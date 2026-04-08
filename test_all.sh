#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5099}"

if ! command -v curl >/dev/null 2>&1; then
  echo "[FATAL] curl is required but not found."
  exit 1
fi

if command -v node.exe >/dev/null 2>&1; then
  NODE_BIN="$(command -v node.exe)"
elif command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
else
  echo "[FATAL] node (or node.exe) is required for JSON parsing but not found."
  exit 1
fi

LOG_PREFIX="[REGRESSION]"
RESPONSE_CODE=""
RESPONSE_BODY=""

log() {
  echo "${LOG_PREFIX} $*"
}

fail() {
  echo "${LOG_PREFIX} [FAIL] $*"
  echo "${LOG_PREFIX} Last HTTP code: ${RESPONSE_CODE}"
  echo "${LOG_PREFIX} Last response: ${RESPONSE_BODY}"
  exit 1
}

json_get() {
  local json_input="$1"
  local path="$2"

  "$NODE_BIN" -e '
const input = process.argv[1];
const path = process.argv[2];

let data;
try {
  data = JSON.parse(input);
} catch {
  process.exit(3);
}

const segments = path.split(".").filter(Boolean);
let current = data;

for (const segment of segments) {
  if (current === null || current === undefined) {
    process.exit(4);
  }

  const match = segment.match(/^(.+)\[(\d+)\]$/);
  if (match) {
    const key = match[1];
    const index = Number(match[2]);
    current = current[key];
    if (!Array.isArray(current) || index >= current.length) {
      process.exit(5);
    }
    current = current[index];
    continue;
  }

  current = current[segment];
}

if (current === null || current === undefined) {
  process.exit(6);
}

if (typeof current === "object") {
  process.stdout.write(JSON.stringify(current));
} else {
  process.stdout.write(String(current));
}
' "$json_input" "$path"
}

json_contains() {
  local json_input="$1"
  local path="$2"
  local expected="$3"

  "$NODE_BIN" -e '
const input = process.argv[1];
const path = process.argv[2];
const expected = process.argv[3];

let data;
try {
  data = JSON.parse(input);
} catch {
  process.exit(3);
}

const segments = path.split(".").filter(Boolean);
let current = data;
for (const segment of segments) {
  current = current?.[segment];
}

if (!Array.isArray(current)) {
  process.exit(4);
}

const hasMatch = current.some(item => {
  if (typeof item === "string") {
    return item === expected;
  }

  if (item && typeof item === "object") {
    return Object.values(item).some(value => String(value) === expected);
  }

  return String(item) === expected;
});

if (!hasMatch) {
  process.exit(5);
}
' "$json_input" "$path" "$expected"
}

json_success_true() {
  local json_input="$1"
  local success
  success="$(json_get "$json_input" "success" 2>/dev/null || true)"
  [[ "$success" == "true" ]]
}

request() {
  local method="$1"
  local endpoint="$2"
  local token="${3:-}"
  local body="${4:-}"
  local tmp_body
  tmp_body="$(mktemp)"

  local -a args
  args=(-sS -o "$tmp_body" -w "%{http_code}" -X "$method" "$BASE_URL$endpoint")

  if [[ -n "$token" ]]; then
    args+=(-H "Authorization: Bearer $token")
  fi

  if [[ -n "$body" ]]; then
    args+=(-H "Content-Type: application/json" -d "$body")
  fi

  RESPONSE_CODE="$(curl "${args[@]}")"
  RESPONSE_BODY="$(cat "$tmp_body")"
  rm -f "$tmp_body"

  log "$method $endpoint -> HTTP $RESPONSE_CODE"
  log "Response: $RESPONSE_BODY"
}

assert_status() {
  local expected="$1"
  if [[ "$RESPONSE_CODE" != "$expected" ]]; then
    fail "Expected HTTP $expected but got $RESPONSE_CODE"
  fi
}

assert_success_true() {
  if ! json_success_true "$RESPONSE_BODY"; then
    fail "Expected success=true in API response"
  fi
}

assert_success_false() {
  local success
  success="$(json_get "$RESPONSE_BODY" "success" 2>/dev/null || true)"
  if [[ "$success" != "false" ]]; then
    fail "Expected success=false in API response"
  fi
}

extract_or_fail() {
  local path="$1"
  local value
  value="$(json_get "$RESPONSE_BODY" "$path" 2>/dev/null || true)"
  if [[ -z "$value" ]]; then
    fail "Unable to extract JSON path '$path'"
  fi
  echo "$value"
}

wait_for_server() {
  local max_attempts=40
  local attempt=1
  while (( attempt <= max_attempts )); do
    local code
    code="$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/posts" || true)"
    if [[ "$code" == "200" ]]; then
      log "Server is ready at $BASE_URL"
      return 0
    fi

    sleep 1
    attempt=$((attempt + 1))
  done

  echo "[FATAL] Server at $BASE_URL is not reachable after $max_attempts seconds."
  exit 1
}

log "Starting regression run against $BASE_URL"
wait_for_server

ts="$(date +%s)"
user_a_username="test_user_a_${ts}"
user_b_username="test_user_b_${ts}"
user_a_email="${user_a_username}@example.com"
user_b_email="${user_b_username}@example.com"
password="Pass@123"

log "STEP 1: Register user_a"
request "POST" "/api/auth/register" "" "{\"username\":\"${user_a_username}\",\"email\":\"${user_a_email}\",\"password\":\"${password}\",\"fullName\":\"Test User A\"}"
assert_status "200"
assert_success_true

log "STEP 2: Register user_b"
request "POST" "/api/auth/register" "" "{\"username\":\"${user_b_username}\",\"email\":\"${user_b_email}\",\"password\":\"${password}\",\"fullName\":\"Test User B\"}"
assert_status "200"
assert_success_true

log "STEP 3: Login user_a"
request "POST" "/api/auth/login" "" "{\"username\":\"${user_a_username}\",\"password\":\"${password}\"}"
assert_status "200"
assert_success_true
token_a="$(extract_or_fail "data.token")"
user_a_id="$(extract_or_fail "data.userId")"

log "STEP 4: Login user_b"
request "POST" "/api/auth/login" "" "{\"username\":\"${user_b_username}\",\"password\":\"${password}\"}"
assert_status "200"
assert_success_true
token_b="$(extract_or_fail "data.token")"
user_b_id="$(extract_or_fail "data.userId")"

log "STEP 5: user_a creates post"
request "POST" "/api/posts" "$token_a" "{\"content\":\"Regression post from user_a at ${ts}\"}"
assert_status "201"
assert_success_true
post_id="$(extract_or_fail "data.id")"

log "STEP 6: user_b comments on user_a post"
request "POST" "/api/comments/post/${post_id}" "$token_b" "{\"content\":\"Regression comment from user_b\"}"
assert_status "201"
assert_success_true
comment_id="$(extract_or_fail "data.id")"

log "STEP 7: user_a likes post and expects isLiked=true"
request "POST" "/api/likes/post/${post_id}" "$token_a"
assert_status "200"
assert_success_true
post_like_state="$(extract_or_fail "data.isLiked")"
if [[ "$post_like_state" != "true" ]]; then
  fail "Expected data.isLiked=true for post like toggle"
fi

log "STEP 8: user_b likes comment and expects isLiked=true"
request "POST" "/api/likes/comment/${comment_id}" "$token_b"
assert_status "200"
assert_success_true
comment_like_state="$(extract_or_fail "data.isLiked")"
if [[ "$comment_like_state" != "true" ]]; then
  fail "Expected data.isLiked=true for comment like toggle"
fi

log "STEP 9: user_b reports user_a post"
request "POST" "/api/reports/post/${post_id}" "$token_b" "{\"reason\":\"Regression report reason\"}"
assert_status "201"
assert_success_true
report_post_id="$(extract_or_fail "data.postId")"
if [[ "$report_post_id" != "$post_id" ]]; then
  fail "Reported postId mismatch. Expected ${post_id}, got ${report_post_id}"
fi

log "STEP 10: user_a follows user_b"
request "POST" "/api/friends/${user_b_id}" "$token_a"
assert_status "200"
assert_success_true

log "STEP 11: verify user_a following contains user_b"
request "GET" "/api/friends/${user_a_id}/following" "$token_a"
assert_status "200"
assert_success_true
if ! json_contains "$RESPONSE_BODY" "data" "$user_b_id"; then
  fail "Following list for user_a does not contain user_b"
fi

log "STEP 12: user_a creates story"
request "POST" "/api/stories" "$token_a" "{\"content\":\"Regression story from user_a\"}"
assert_status "201"
assert_success_true
story_id="$(extract_or_fail "data.id")"

log "STEP 13: user_b tries deleting user_a story and expects 403"
request "DELETE" "/api/stories/${story_id}" "$token_b"
assert_status "403"
assert_success_false

log "STEP 14: user_a deletes own story successfully"
request "DELETE" "/api/stories/${story_id}" "$token_a"
assert_status "200"
assert_success_true

log "STEP 15: notifications endpoint sanity check"
request "GET" "/api/notifications" "$token_a"
assert_status "200"
assert_success_true

log "STEP 16: user_a updates own profile"
request "PUT" "/api/users/${user_a_id}" "$token_a" "{\"bio\":\"QA regression bio\",\"avatarUrl\":\"https://example.com/avatar-a.png\"}"
assert_status "200"
assert_success_true

log "STEP 17: user_a tries updating user_b profile and expects 403"
request "PUT" "/api/users/${user_b_id}" "$token_a" "{\"bio\":\"Unauthorized update attempt\"}"
assert_status "403"
assert_success_false

echo "REGRESSION TEST COMPLETED. ALL CRITICAL PATHS ARE STABLE."