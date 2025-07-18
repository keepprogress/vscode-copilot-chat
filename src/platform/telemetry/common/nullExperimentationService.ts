/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createServiceIdentifier } from '../../../util/common/services';

/**
 * 實驗服務提供 A/B 實驗功能
 * 目前設計上只允許同時查詢一個功能開關
 * 這是為了讓我們在調用這些方法時能夠控制事件和遙測數據
 * Experimentation service provides A/B experimentation functionality.
 * Currently it's per design to be able to only allow querying one flight at the time.
 * This is in order for us to control events and telemetry whenever these methods are called.
 */
export interface IExperimentationService {

	readonly _serviceBrand: undefined;

	/**
	 * 指示實驗服務已初始化的 Promise，因此可以安全地調用 isFlightEnabled
	 * Promise indicating that the experimentation service has been
	 * initialized, so it's safe to make a call to isFlightEnabled.
	 */
	readonly initializePromise: Promise<void>;
	/**
	 * 當實驗服務完成對治療分配服務的第一次請求時解析的 Promise
	 * 如果此請求成功，功能開關將是最新的
	 * Promise that resolves when the experimentation service has completed
	 * its first request to the Treatment Assignment Service. If this request
	 * is successful, flights are up-to-date.
	 */
	readonly initialFetch: Promise<void>;
	/**
	 * @deprecated Use `getTreatmentVariable` instead.
	 *
	 * Returns a value indicating whether the given flight is enabled.
	 * It uses the values currently in memory, so the experimentation service
	 * must be initialized before calling.
	 * @param flight The flight to check.
	 */
	isFlightEnabled(flight: string): boolean;
	/**
	 * @deprecated Use `getTreatmentVariable` instead.
	 *
	 * Returns a value indicating whether the given flight is enabled.
	 * It uses the values currently on cache.
	 * @param flight The flight to check.
	 */
	isCachedFlightEnabled(flight: string): Promise<boolean>;
	/**
	 * @deprecated Use `getTreatmentVariableAsync` instead.
	 *
	 * Returns a value indicating whether the given flight is enabled.
	 * It re-fetches values from the server.
	 * @param flight the flight to check.
	 */
	isFlightEnabledAsync(flight: string): Promise<boolean>;
	/**
	 * 返回治療變量的值，如果未找到則返回 undefined
	 * 使用當前記憶體中的值，因此在調用之前必須初始化實驗服務
	 * Returns the value of the treatment variable, or undefined if not found.
	 * It uses the values currently in memory, so the experimentation service
	 * must be initialized before calling.
	 * @param config name of the config to check.
	 * @param name name of the treatment variable.
	 */
	getTreatmentVariable<T extends boolean | number | string>(configId: string, name: string): T | undefined;
	/**
	 * Returns the value of the treatment variable, or undefined if not found.
	 * It re-fetches values from the server. If checkCache is true and the value exists
	 * in the cache, the Treatment Assignment Service is not called.
	 * @param config name of the config to check.
	 * @param name name of the treatment variable.
	 * @param checkCache check the cache for the variable before calling the TAS.
	 */
	getTreatmentVariableAsync<T extends boolean | number | string>(configId: string, name: string, checkCache?: boolean): Promise<T | undefined>;
}

export const IExperimentationService = createServiceIdentifier<IExperimentationService>('IExperimentationService');


export class NullExperimentationService implements IExperimentationService {
	declare readonly _serviceBrand: undefined;
	readonly initializePromise: Promise<void> = Promise.resolve();
	readonly initialFetch: Promise<void> = Promise.resolve();

	// 空實現：總是返回 false，不啟用任何實驗功能
	// Null implementation: always returns false, no experimental features enabled
	isFlightEnabled(_flight: string): boolean {
		return false;
	}

	isCachedFlightEnabled(_flight: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	isFlightEnabledAsync(_flight: string): Promise<boolean> {
		return Promise.resolve(false);
	}

	getTreatmentVariable<T extends boolean | number | string>(_configId: string, _name: string): T | undefined {
		return undefined;
	}

	getTreatmentVariableAsync<T extends boolean | number | string>(
		_configId: string,
		_name: string,
	): Promise<T | undefined> {
		return Promise.resolve(undefined);
	}
}
