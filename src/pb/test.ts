/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal.js";
import { Timestamp } from "./google/protobuf/timestamp.js";

export interface Ping {
  text: string[];
  created: Date | undefined;
}

export interface Pong {
  accepted: Date | undefined;
}

function createBasePing(): Ping {
  return { text: [], created: undefined };
}

export const Ping = {
  encode(message: Ping, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.text) {
      writer.uint32(10).string(v!);
    }
    if (message.created !== undefined) {
      Timestamp.encode(
        toTimestamp(message.created),
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Ping {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePing();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.text.push(reader.string());
          break;
        case 2:
          message.created = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Ping {
    return {
      text: Array.isArray(object?.text)
        ? object.text.map((e: any) => String(e))
        : [],
      created: isSet(object.created)
        ? fromJsonTimestamp(object.created)
        : undefined,
    };
  },

  toJSON(message: Ping): unknown {
    const obj: any = {};
    if (message.text) {
      obj.text = message.text.map((e) => e);
    } else {
      obj.text = [];
    }
    message.created !== undefined &&
      (obj.created = message.created.toISOString());
    return obj;
  },
};

function createBasePong(): Pong {
  return { accepted: undefined };
}

export const Pong = {
  encode(message: Pong, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accepted !== undefined) {
      Timestamp.encode(
        toTimestamp(message.accepted),
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Pong {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePong();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.accepted = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Pong {
    return {
      accepted: isSet(object.accepted)
        ? fromJsonTimestamp(object.accepted)
        : undefined,
    };
  },

  toJSON(message: Pong): unknown {
    const obj: any = {};
    message.accepted !== undefined &&
      (obj.accepted = message.accepted.toISOString());
    return obj;
  },
};

export type TestDefinition = typeof TestDefinition;
export const TestDefinition = {
  name: "Test",
  fullName: "test.Test",
  methods: {
    req: {
      name: "Req",
      requestType: Ping,
      requestStream: false,
      responseType: Pong,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface TestServiceImplementation<CallContextExt = {}> {
  req(request: Ping, context: CallContext & CallContextExt): Promise<Pong>;
}

export interface TestClient<CallOptionsExt = {}> {
  req(request: Ping, options?: CallOptions & CallOptionsExt): Promise<Pong>;
}

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
