/*
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache License Version 2.0.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2016-Present Datadog, Inc.
 */

import { NativeModules } from 'react-native'
import { DdSdkReactNativeConfiguration } from '../DdSdkReactNativeConfiguration'
import type { DdSdkConfiguration } from '../types'
import { DdSdkReactNative } from '../DdSdkReactNative'
import { DdRumUserInteractionTracking } from '../rum/instrumentation/DdRumUserInteractionTracking'
import { DdRumErrorTracking } from '../rum/instrumentation/DdRumErrorTracking'

jest.mock('react-native', () => {
    return {
        NativeModules: {
            DdSdk: {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                initialize: jest.fn().mockImplementation(() => { })
            }
        }
    };
});

jest.mock('../rum/instrumentation/DdRumUserInteractionTracking', () => {
    return {
        DdRumUserInteractionTracking: {
            startTracking: jest.fn().mockImplementation(() => { })
        }
    }
})

jest.mock('../rum/instrumentation/DdRumErrorTracking', () => {
    return {
        DdRumErrorTracking: {
            startTracking: jest.fn().mockImplementation(() => { })
        }
    }
})

beforeEach(async () => {
    DdSdkReactNative['wasInitialized'] = false;
    NativeModules.DdSdk.initialize.mockReset()
})

it('M initialize the SDK W initialize', async () => {
    // GIVEN
    const fakeAppId = "1"
    const fakeClientToken = "2"
    const fakeEnvName = "env"
    const configuration = new DdSdkReactNativeConfiguration(fakeClientToken, fakeEnvName, fakeAppId)

    // WHEN
    DdSdkReactNative.initialize(configuration)

    // THEN
    expect(NativeModules.DdSdk.initialize.mock.calls.length).toBe(1);
    const ddsdkConfiguration = NativeModules.DdSdk.initialize.mock.calls[0][0] as DdSdkConfiguration
    expect(ddsdkConfiguration.clientToken).toBe(fakeClientToken)
    expect(ddsdkConfiguration.applicationId).toBe(fakeAppId)
    expect(ddsdkConfiguration.env).toBe(fakeEnvName)
})

it('M initialize once W initialize { multiple times in a row }', async () => {
    // GIVEN
    const fakeAppId = "1"
    const fakeClientToken = "2"
    const fakeEnvName = "env"
    const configuration = new DdSdkReactNativeConfiguration(fakeClientToken, fakeEnvName, fakeAppId)

    // WHEN
    DdSdkReactNative.initialize(configuration)
    DdSdkReactNative.initialize(configuration)
    DdSdkReactNative.initialize(configuration)
    DdSdkReactNative.initialize(configuration)

    // THEN
    expect(NativeModules.DdSdk.initialize.mock.calls.length).toBe(1);
    const ddsdkConfiguration = NativeModules.DdSdk.initialize.mock.calls[0][0] as DdSdkConfiguration
    expect(ddsdkConfiguration.clientToken).toBe(fakeClientToken)
    expect(ddsdkConfiguration.applicationId).toBe(fakeAppId)
    expect(ddsdkConfiguration.env).toBe(fakeEnvName)
})

it('M enable user interaction feature W initialize { user interaction config enabled }', async () => {
    // GIVEN
    const fakeAppId = "1"
    const fakeClientToken = "2"
    const fakeEnvName = "env"
    const configuration = new DdSdkReactNativeConfiguration(fakeClientToken, fakeEnvName, fakeAppId, true)

    // WHEN
    DdSdkReactNative.initialize(configuration)

    // THEN
    expect(NativeModules.DdSdk.initialize.mock.calls.length).toBe(1);
    const ddsdkConfiguration = NativeModules.DdSdk.initialize.mock.calls[0][0] as DdSdkConfiguration
    expect(ddsdkConfiguration.clientToken).toBe(fakeClientToken)
    expect(ddsdkConfiguration.applicationId).toBe(fakeAppId)
    expect(ddsdkConfiguration.env).toBe(fakeEnvName)
    expect(DdRumUserInteractionTracking.startTracking).toHaveBeenCalledTimes(1)
})

it('M enable error tracking feature W initialize { error tracking config enabled }', async () => {
    // GIVEN
    const fakeAppId = "1"
    const fakeClientToken = "2"
    const fakeEnvName = "env"
    const configuration = new DdSdkReactNativeConfiguration(fakeClientToken, fakeEnvName, fakeAppId, false, true)

    // WHEN
    DdSdkReactNative.initialize(configuration)

    // THEN
    expect(NativeModules.DdSdk.initialize.mock.calls.length).toBe(1);
    const ddsdkConfiguration = NativeModules.DdSdk.initialize.mock.calls[0][0] as DdSdkConfiguration
    expect(ddsdkConfiguration.clientToken).toBe(fakeClientToken)
    expect(ddsdkConfiguration.applicationId).toBe(fakeAppId)
    expect(ddsdkConfiguration.env).toBe(fakeEnvName)
    expect(DdRumErrorTracking.startTracking).toHaveBeenCalledTimes(1)
})