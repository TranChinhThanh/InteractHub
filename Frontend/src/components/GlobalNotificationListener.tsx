import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { notifyInfo } from "../utils/notify";

function GlobalNotificationListener() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      return;
    }

    let isDisposed = false;

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5035/hubs/notifications", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", () => {
      notifyInfo("Bạn có thông báo mới!");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    const startConnection = async () => {
      try {
        await connection.start();
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const isNegotiationAbort = message.includes(
          "stopped during negotiation",
        );

        if (!isDisposed && !isNegotiationAbort) {
          console.error("SignalR connection start failed:", error);
        }
      }
    };

    void startConnection();

    return () => {
      isDisposed = true;
      connection.off("ReceiveNotification");
      void connection.stop();
    };
  }, [token, queryClient]);

  return null;
}

export default GlobalNotificationListener;
