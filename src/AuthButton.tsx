"use client";

import { useState, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import supabase from "../lib/supabase";

const AuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 認証状態を確認
    const checkAuthStatus = async () => {
      // const { data } = await supabase.auth.getSession();
      // if (data.session) {
      //   setIsAuthenticated(true);
      //   setUserName(data.session.user.user_metadata.full_name || data.session.user.email);
      // }
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("セッション取得エラー:", error);
      } else {
        console.log("現在のセッション:", data);
        if (data.session) {
          setIsAuthenticated(true);
          setUserName(data.session.user.user_metadata.full_name || data.session.user.email);
        } else {
          console.log("セッションが見つかりません。");
        }
      }
    };

    // 初期チェック
    checkAuthStatus();

    // Supabaseの認証イベントリスナーを設定
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserName(session.user.user_metadata.full_name || session.user.email);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (provider: "google" | "twitter") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setMessage("認証に失敗しました");
    }
  };

  const handleExtraAction = () => {
    setMessage("追加のボタンが押されました！");
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={() => handleLogin("google")}
      >
        Googleでログイン
      </Button>
      <Button
        variant="contained"
        startIcon={<XIcon />}
        onClick={() => handleLogin("twitter")}
      >
        Xでログイン
      </Button>
      {isAuthenticated && (
        <Typography variant="h6">ようこそ、{userName}さん</Typography>
      )}
      <Button
        variant="contained"
        disabled={!isAuthenticated}
        color={isAuthenticated ? "primary" : "inherit"}
        onClick={handleExtraAction}
      >
        認証後に押せるボタン
      </Button>
      {message && <Typography color="textSecondary">{message}</Typography>}
    </Stack>
  );
};

export default AuthButton;
