package com.ledblink.ir

import android.content.Context
import android.hardware.ConsumerIrManager
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.roundToInt

class IrModule : Module() {
  private val tag = "IrModule"

  override fun definition() = ModuleDefinition {
    Name("IrModule")

    Function("hasIrEmitter") {
      val manager = irManager()
      val hasEmitter = manager?.hasIrEmitter() == true
      Log.i(tag, "hasIrEmitter -> $hasEmitter")
      hasEmitter
    }

    Function("getCarrierFrequencies") {
      val manager = irManager()
      val frequencies = manager?.carrierFrequencies
      if (frequencies == null) {
        Log.w(tag, "getCarrierFrequencies -> no IR manager or frequencies unavailable")
        return@Function emptyList<Map<String, Int>>()
      }

      val list = frequencies.map {
        mapOf(
          "minFrequency" to it.minFrequency,
          "maxFrequency" to it.maxFrequency
        )
      }
      Log.i(tag, "getCarrierFrequencies -> ${list.size} ranges")
      list
    }

    Function("sendIr") { pattern: String ->
      Log.i(tag, "sendIr invoked with pattern length=${pattern.length}")

      val manager = irManager()
      if (manager == null) {
        val message = "IR manager not available"
        Log.e(tag, message)
        throw IllegalStateException(message)
      }

      if (!manager.hasIrEmitter()) {
        val message = "Device has no IR emitter"
        Log.e(tag, message)
        throw IllegalStateException(message)
      }

      val parsed = parsePronto(pattern)
      if (parsed == null) {
        val message = "Failed to parse IR pattern"
        Log.e(tag, message)
        throw IllegalArgumentException(message)
      }

      val (frequency, timings) = parsed
      Log.i(
        tag,
        "Transmitting IR: frequency=${frequency}Hz, timings=${timings.size} items"
      )

      manager.transmit(frequency, timings)
      Log.i(tag, "IR transmit completed")
      true
    }
  }

private fun irManager(): ConsumerIrManager? {
  val ctx = appContext.reactContext ?: return null
  val manager = ctx.getSystemService(Context.CONSUMER_IR_SERVICE) as? ConsumerIrManager
  if (manager == null) {
    Log.w(tag, "ConsumerIrManager service not available")
  }
  return manager
}

  private fun parsePronto(pronto: String): Pair<Int, IntArray>? {
    val tokens = pronto.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
    if (tokens.size < 4) {
      Log.e(tag, "Pronto parse error: not enough tokens")
      return null
    }

    val words = try {
      tokens.map { it.toInt(16) }
    } catch (e: NumberFormatException) {
      Log.e(tag, "Pronto parse error: invalid hex token", e)
      return null
    }

    val format = words[0]
    val freqWord = words[1]
    val burstPairCount = words[2] + words[3]
    if (format != 0x0000) {
      Log.e(tag, "Pronto parse error: unsupported format $format")
      return null
    }

    if (freqWord == 0) {
      Log.e(tag, "Pronto parse error: frequency word is zero")
      return null
    }

    val carrierFreq = (1_000_000.0 / (freqWord * 0.241246)).roundToInt()
    val expectedTimingWords = burstPairCount * 2
    val timingStart = 4
    val timingEnd = timingStart + expectedTimingWords

    if (words.size < timingEnd) {
      Log.e(
        tag,
        "Pronto parse error: not enough timing data (have=${words.size}, need=$timingEnd)"
      )
      return null
    }

    val pulseTicks = words.subList(timingStart, timingEnd)
    val timePerTickUs = freqWord * 0.241246
    val timings = pulseTicks.map { (it * timePerTickUs).roundToInt().coerceAtLeast(1) }

    Log.i(
      tag,
      "Pronto parsed: carrier=${carrierFreq}Hz, timingCount=${timings.size}"
    )

    return carrierFreq to timings.toIntArray()
  }
}
