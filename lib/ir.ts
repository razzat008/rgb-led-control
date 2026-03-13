import { Platform } from "react-native";
import { requireNativeModule } from "expo-modules-core";

type CarrierFrequencyRange = {
  minFrequency: number;
  maxFrequency: number;
};

type IrNativeModule = {
  hasIrEmitter: () => boolean;
  getCarrierFrequencies: () => CarrierFrequencyRange[];
  sendIr: (pattern: string) => boolean;
};

const TAG = "IR";

const logInfo = (message: string, details?: Record<string, unknown>) => {
  if (details) {
    console.info(`[${TAG}] ${message}`, details);
  } else {
    console.info(`[${TAG}] ${message}`);
  }
};

const logWarn = (message: string, details?: Record<string, unknown>) => {
  if (details) {
    console.warn(`[${TAG}] ${message}`, details);
  } else {
    console.warn(`[${TAG}] ${message}`);
  }
};

const logError = (message: string, error?: unknown) => {
  if (error) {
    console.error(`[${TAG}] ${message}`, error);
  } else {
    console.error(`[${TAG}] ${message}`);
  }
};

const getNativeModule = (): IrNativeModule | null => {
  if (Platform.OS !== "android") {
    logWarn("IR is only supported on Android.", { platform: Platform.OS });
    return null;
  }

  try {
    const module = requireNativeModule<IrNativeModule>("IrModule");
    return module ?? null;
  } catch (error) {
    logWarn("IR native module is not available.", { error });
    return null;
  }
};

export const hasIrEmitter = async (): Promise<boolean> => {
  const native = getNativeModule();
  if (!native) {
    logWarn("hasIrEmitter: native module missing.");
    return false;
  }

  try {
    const result = native.hasIrEmitter();
    logInfo("hasIrEmitter result", { result });
    return Boolean(result);
  } catch (error) {
    logError("hasIrEmitter failed.", error);
    return false;
  }
};

export const getCarrierFrequencies = async (): Promise<CarrierFrequencyRange[]> => {
  const native = getNativeModule();
  if (!native) {
    logWarn("getCarrierFrequencies: native module missing.");
    return [];
  }

  try {
    const ranges = native.getCarrierFrequencies();
    logInfo("getCarrierFrequencies result", { count: ranges?.length ?? 0 });
    return ranges ?? [];
  } catch (error) {
    logError("getCarrierFrequencies failed.", error);
    return [];
  }
};

export const sendIr = async (pattern: string): Promise<boolean> => {
  if (!pattern || !pattern.trim()) {
    logWarn("sendIr called with empty pattern.");
    return false;
  }

  const native = getNativeModule();
  if (!native) {
    logWarn("sendIr: native module missing.");
    return false;
  }

  try {
    logInfo("sendIr invoked", { length: pattern.length });
    const result = native.sendIr(pattern);
    logInfo("sendIr completed", { result });
    return Boolean(result);
  } catch (error) {
    logError("sendIr failed.", error);
    return false;
  }
};

export default {
  hasIrEmitter,
  getCarrierFrequencies,
  sendIr,
};
