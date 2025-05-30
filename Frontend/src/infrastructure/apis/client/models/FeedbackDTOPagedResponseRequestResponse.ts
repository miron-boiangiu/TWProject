/* tslint:disable */
/* eslint-disable */
/**
 * MobyLab Web App
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { FeedbackDTOPagedResponse } from './FeedbackDTOPagedResponse';
import {
    FeedbackDTOPagedResponseFromJSON,
    FeedbackDTOPagedResponseFromJSONTyped,
    FeedbackDTOPagedResponseToJSON,
    FeedbackDTOPagedResponseToJSONTyped,
} from './FeedbackDTOPagedResponse';
import type { ErrorMessage } from './ErrorMessage';
import {
    ErrorMessageFromJSON,
    ErrorMessageFromJSONTyped,
    ErrorMessageToJSON,
    ErrorMessageToJSONTyped,
} from './ErrorMessage';

/**
 * 
 * @export
 * @interface FeedbackDTOPagedResponseRequestResponse
 */
export interface FeedbackDTOPagedResponseRequestResponse {
    /**
     * 
     * @type {FeedbackDTOPagedResponse}
     * @memberof FeedbackDTOPagedResponseRequestResponse
     */
    readonly response?: FeedbackDTOPagedResponse | null;
    /**
     * 
     * @type {ErrorMessage}
     * @memberof FeedbackDTOPagedResponseRequestResponse
     */
    readonly errorMessage?: ErrorMessage | null;
}

/**
 * Check if a given object implements the FeedbackDTOPagedResponseRequestResponse interface.
 */
export function instanceOfFeedbackDTOPagedResponseRequestResponse(value: object): value is FeedbackDTOPagedResponseRequestResponse {
    return true;
}

export function FeedbackDTOPagedResponseRequestResponseFromJSON(json: any): FeedbackDTOPagedResponseRequestResponse {
    return FeedbackDTOPagedResponseRequestResponseFromJSONTyped(json, false);
}

export function FeedbackDTOPagedResponseRequestResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FeedbackDTOPagedResponseRequestResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'response': json['response'] == null ? undefined : FeedbackDTOPagedResponseFromJSON(json['response']),
        'errorMessage': json['errorMessage'] == null ? undefined : ErrorMessageFromJSON(json['errorMessage']),
    };
}

export function FeedbackDTOPagedResponseRequestResponseToJSON(json: any): FeedbackDTOPagedResponseRequestResponse {
    return FeedbackDTOPagedResponseRequestResponseToJSONTyped(json, false);
}

export function FeedbackDTOPagedResponseRequestResponseToJSONTyped(value?: Omit<FeedbackDTOPagedResponseRequestResponse, 'response'|'errorMessage'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

