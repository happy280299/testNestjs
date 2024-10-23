// src/app.module.ts
import { Module } from '@nestjs/common';
import { WebRtcGateway } from './webrtc.gateway';

@Module({
  imports: [],
  providers: [WebRtcGateway],
})
export class AppModule {}
