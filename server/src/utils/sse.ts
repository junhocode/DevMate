import { Request, Response } from 'express';

export const userConnections: { [key: string]: Response } = {};

// ✅ SSE 연결을 맺는 전용 API
export const sseHandler = (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  // 기존 연결 닫기
  if (userConnections[userId]) {
    console.log(`${userId}의 기존 연결 닫기`);
    userConnections[userId].end();
    delete userConnections[userId];
  }

  // SSE 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  userConnections[userId] = res;

  // 연결이 끊어지면 삭제
  req.on('close', () => {
    delete userConnections[userId];
    console.log(`${userId} 연결 끊어짐`);
  });
};

// ✅ 특정 유저에게 SSE 이벤트 전송
export const sendSSE = (userId: string, message: string) => {
  if (userConnections[userId]) {
    userConnections[userId].write(`data: ${message}\n\n`);
  } else {
    console.error(`No active SSE connection for userId: ${userId}`);
  }
};
