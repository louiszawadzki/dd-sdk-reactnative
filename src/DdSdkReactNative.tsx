/*
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache License Version 2.0.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2016-Present Datadog, Inc.
 */

import type { DdSdkReactNativeConfiguration } from "./DdSdkReactNativeConfiguration"
import { DdSdkConfiguration, DdSdkType } from "./types"
import { NativeModules } from 'react-native'
import { DdRumUserInteractionTracking } from './rum/instrumentation/DdRumUserInteractionTracking'
import { DdRumErrorTracking } from './rum/instrumentation/DdRumErrorTracking'

const DdSdk: DdSdkType = NativeModules.DdSdk;

/**
 * This class initializes the Datadog SDK, and sets up communication with the server.
 */
export class DdSdkReactNative {
    private static wasInitialized = false

    /**
    * Initializes the Datadog SDK.
    * @param configuration the configuration for the SDK library
    * @returns a Promise.
    */
    static initialize(configuration: DdSdkReactNativeConfiguration): Promise<void> {
        return new Promise<void>((resolve => {
            if (this.wasInitialized) {
                resolve()
                return
            }
            DdSdk.initialize(new DdSdkConfiguration(configuration.clientToken, configuration.env, configuration.applicationId))
            this.enableFeatures(configuration)
            this.wasInitialized = true
            resolve()
        }))

    }

    private static enableFeatures(configuration: DdSdkReactNativeConfiguration) {
        if (configuration.trackInteractions) {
            DdRumUserInteractionTracking.startTracking()
        }

        if (configuration.trackErrors) {
            DdRumErrorTracking.startTracking()
        }
    }
}