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
/**
 * 
 * @export
 * @interface UserUpdateDTO
 */
export interface UserUpdateDTO {
    /**
     * 
     * @type {string}
     * @memberof UserUpdateDTO
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserUpdateDTO
     */
    name?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserUpdateDTO
     */
    password?: string | null;
}

/**
 * Check if a given object implements the UserUpdateDTO interface.
 */
export function instanceOfUserUpdateDTO(value: object): value is UserUpdateDTO {
    if (!('id' in value) || value['id'] === undefined) return false;
    return true;
}

export function UserUpdateDTOFromJSON(json: any): UserUpdateDTO {
    return UserUpdateDTOFromJSONTyped(json, false);
}

export function UserUpdateDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserUpdateDTO {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'password': json['password'] == null ? undefined : json['password'],
    };
}

export function UserUpdateDTOToJSON(json: any): UserUpdateDTO {
    return UserUpdateDTOToJSONTyped(json, false);
}

export function UserUpdateDTOToJSONTyped(value?: UserUpdateDTO | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'password': value['password'],
    };
}

