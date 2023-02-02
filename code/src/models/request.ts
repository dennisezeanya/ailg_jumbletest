import { Schema, model } from "mongoose";

interface IRequest {
  method: string;
  path: string;
  payload: any;
  timestamp: Date;
}

const requestSchema = new Schema<IRequest>({
  method: { type: String, required: true },
  path: { type: String, required: true },
  payload: {},
  timestamp: { type: Date, default: new Date() },
});

export const RequestModel = model("Request", requestSchema);
