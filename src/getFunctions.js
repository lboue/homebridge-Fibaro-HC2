//    Copyright 2018 ilcato
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
// Fibaro Home Center 2 Platform plugin for HomeBridge
'use strict';
exports.__esModule = true;
var setFunctions_1 = require("./setFunctions");
var GetFunctions = /** @class */ (function () {
    function GetFunctions(hapCharacteristic, platform) {
        this.hapCharacteristic = hapCharacteristic;
        this.platform = platform;
        this.getFunctionsMapping = new Map([
            [(new hapCharacteristic.On()).UUID, this.getBool],
            [(new hapCharacteristic.Brightness()).UUID, this.getBrightness],
            [(new hapCharacteristic.PositionState()).UUID, this.getPositionState],
            [(new hapCharacteristic.CurrentPosition()).UUID, this.getCurrentPosition],
            [(new hapCharacteristic.TargetPosition()).UUID, this.getCurrentPosition],
            [(new hapCharacteristic.MotionDetected()).UUID, this.getBool],
            [(new hapCharacteristic.CurrentTemperature()).UUID, this.getFloat],
            [(new hapCharacteristic.TargetTemperature()).UUID, this.getTargetTemperature],
            [(new hapCharacteristic.CurrentRelativeHumidity()).UUID, this.getFloat],
            [(new hapCharacteristic.ContactSensorState()).UUID, this.getContactSensorState],
            [(new hapCharacteristic.LeakDetected()).UUID, this.getLeakDetected],
            [(new hapCharacteristic.SmokeDetected()).UUID, this.getSmokeDetected],
            [(new hapCharacteristic.CarbonMonoxideDetected()).UUID, this.getCarbonMonoxideDetected],
            [(new hapCharacteristic.CarbonMonoxideLevel()).UUID, this.getFloat],
            [(new hapCharacteristic.CarbonMonoxidePeakLevel()).UUID, this.getFloat],
            [(new hapCharacteristic.CurrentAmbientLightLevel()).UUID, this.getFloat],
            [(new hapCharacteristic.OutletInUse()).UUID, this.getOutletInUse],
            [(new hapCharacteristic.LockCurrentState()).UUID, this.getLockCurrentState],
            [(new hapCharacteristic.LockTargetState()).UUID, this.getLockCurrentState],
            [(new hapCharacteristic.CurrentHeatingCoolingState()).UUID, this.getCurrentHeatingCoolingState],
            [(new hapCharacteristic.TargetHeatingCoolingState()).UUID, this.getTargetHeatingCoolingState],
            [(new hapCharacteristic.TemperatureDisplayUnits()).UUID, this.getTemperatureDisplayUnits],
            [(new hapCharacteristic.Hue()).UUID, this.getHue],
            [(new hapCharacteristic.Saturation()).UUID, this.getSaturation],
            [(new hapCharacteristic.CurrentDoorState()).UUID, this.getCurrentDoorState],
            [(new hapCharacteristic.TargetDoorState()).UUID, this.getCurrentDoorState],
            [(new hapCharacteristic.ObstructionDetected()).UUID, this.getObstructionDetected],
            [(new hapCharacteristic.BatteryLevel()).UUID, this.getBatteryLevel],
            [(new hapCharacteristic.StatusLowBattery()).UUID, this.getStatusLowBattery],
            [(new hapCharacteristic.ChargingState()).UUID, this.getChargingState]
        ]);
        this.getCurrentSecuritySystemStateMapping = new Map([
            ["AwayArmed", this.hapCharacteristic.SecuritySystemCurrentState.AWAY_ARM],
            ["Disarmed", this.hapCharacteristic.SecuritySystemCurrentState.DISARMED],
            ["NightArmed", this.hapCharacteristic.SecuritySystemCurrentState.NIGHT_ARM],
            ["StayArmed", this.hapCharacteristic.SecuritySystemCurrentState.STAY_ARM],
            ["AlarmTriggered", this.hapCharacteristic.SecuritySystemCurrentState.ALARM_TRIGGERED]
        ]);
        this.getTargetSecuritySystemStateMapping = new Map([
            ["AwayArmed", this.hapCharacteristic.SecuritySystemTargetState.AWAY_ARM],
            ["Disarmed", this.hapCharacteristic.SecuritySystemTargetState.DISARM],
            ["NightArmed", this.hapCharacteristic.SecuritySystemTargetState.NIGHT_ARM],
            ["StayArmed", this.hapCharacteristic.SecuritySystemTargetState.STAY_ARM]
        ]);
    }
    GetFunctions.prototype.returnValue = function (r, callback, characteristic) {
        if (callback)
            callback(undefined, r);
        else
            characteristic.updateValue(r);
    };
    // Boolean getter
    GetFunctions.prototype.getBool = function (callback, characteristic, service, IDs, properties) {
        var v = properties.value;
        var r = (v == "true" || v == "false") ?
            ((v == "false") ? false : true) :
            ((parseInt(v) == 0) ? false : true);
        this.returnValue(r, callback, characteristic);
    };
    // Float getter
    GetFunctions.prototype.getFloat = function (callback, characteristic, service, IDs, properties) {
        var r = parseFloat(properties.value);
        this.returnValue(r, callback, characteristic);
    };
    GetFunctions.prototype.getBrightness = function (callback, characteristic, service, IDs, properties) {
        var r;
        if (service.HSBValue != null) {
            var hsv = this.updateHomeKitColorFromHomeCenter(properties.color, service);
            r = Math.round(hsv.v);
        }
        else {
            r = parseFloat(properties.value);
            if (r == 99)
                r = 100;
        }
        this.returnValue(r, callback, characteristic);
    };
    GetFunctions.prototype.getPositionState = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(this.hapCharacteristic.PositionState.STOPPED, callback, characteristic);
    };
    GetFunctions.prototype.getCurrentPosition = function (callback, characteristic, service, IDs, properties) {
        var r = parseInt(properties.value);
        if (r >= characteristic.props.minValue && r <= characteristic.props.maxValue) {
            if (r == 99)
                r = 100;
        }
        else {
            r = characteristic.props.minValue;
        }
        this.returnValue(r, callback, characteristic);
    };
    GetFunctions.prototype.getTargetTemperature = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(parseFloat(properties.targetLevel), callback, characteristic);
    };
    GetFunctions.prototype.getContactSensorState = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.value == "false" ? this.hapCharacteristic.ContactSensorState.CONTACT_DETECTED : this.hapCharacteristic.ContactSensorState.CONTACT_NOT_DETECTED, callback, characteristic);
    };
    GetFunctions.prototype.getLeakDetected = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.value == "true" ? this.hapCharacteristic.LeakDetected.LEAK_DETECTED : this.hapCharacteristic.LeakDetected.LEAK_NOT_DETECTED, callback, characteristic);
    };
    GetFunctions.prototype.getSmokeDetected = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.value == "true" ? this.hapCharacteristic.SmokeDetected.SMOKE_DETECTED : this.hapCharacteristic.SmokeDetected.SMOKE_NOT_DETECTED, callback, characteristic);
    };
    GetFunctions.prototype.getCarbonMonoxideDetected = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.value == "true" ? this.hapCharacteristic.CarbonMonoxideDetected.CO_LEVELS_ABNORMAL : this.hapCharacteristic.CarbonMonoxideDetected.CO_LEVELS_NORMAL, callback, characteristic);
    };
    GetFunctions.prototype.getOutletInUse = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(parseFloat(properties.power) > 1.0 ? true : false, callback, characteristic);
    };
    GetFunctions.prototype.getLockCurrentState = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.value == "true" ? this.hapCharacteristic.LockCurrentState.SECURED : this.hapCharacteristic.LockCurrentState.UNSECURED, callback, characteristic);
    };
    GetFunctions.prototype.getCurrentHeatingCoolingState = function (callback, characteristic, service, IDs, properties) {
        var _this = this;
        if (service.operatingModeId) { // Operating mode is availble on Home Center
            this.platform.fibaroClient.getDeviceProperties(service.operatingModeId)
                .then(function (properties) {
                switch (properties.mode) {
                    case "0": // OFF
                        _this.returnValue(_this.hapCharacteristic.CurrentHeatingCoolingState.OFF, callback, characteristic);
                        break;
                    case "1": // HEAT
                        _this.returnValue(_this.hapCharacteristic.CurrentHeatingCoolingState.HEAT, callback, characteristic);
                        break;
                    case "2": // COOL
                        _this.returnValue(_this.hapCharacteristic.CurrentHeatingCoolingState.COOL, callback, characteristic);
                        break;
                    default:
                        break;
                }
            })["catch"](function (err) {
                _this.platform.log("There was a problem getting value from: ", service.operatingModeId + " - Err: " + err);
                callback(err, null);
            });
        }
        else {
            if (this.platform.config.enablecoolingstatemanagemnt == "on") { // Simulated operating mode
                var t = parseFloat(properties.value);
                if (t <= setFunctions_1.lowestTemp)
                    this.returnValue(this.hapCharacteristic.CurrentHeatingCoolingState.OFF, callback, characteristic);
                else
                    this.returnValue(this.hapCharacteristic.CurrentHeatingCoolingState.HEAT, callback, characteristic);
            }
            else { // Fake simulated mode: always heat
                this.returnValue(this.hapCharacteristic.CurrentHeatingCoolingState.HEAT, callback, characteristic);
            }
        }
    };
    GetFunctions.prototype.getTargetHeatingCoolingState = function (callback, characteristic, service, IDs, properties) {
        var _this = this;
        if (service.operatingModeId) { // Operating mode is availble on Home Center
            this.platform.fibaroClient.getDeviceProperties(service.operatingModeId)
                .then(function (properties) {
                switch (properties.mode) {
                    case "0": // OFF
                        _this.returnValue(_this.hapCharacteristic.TargetHeatingCoolingState.OFF, callback, characteristic);
                        break;
                    case "1": // HEAT
                        _this.returnValue(_this.hapCharacteristic.TargetHeatingCoolingState.HEAT, callback, characteristic);
                        break;
                    case "2": // COOL
                        _this.returnValue(_this.hapCharacteristic.TargetHeatingCoolingState.COOL, callback, characteristic);
                        break;
                    case "10": // AUTO
                        _this.returnValue(_this.hapCharacteristic.TargetHeatingCoolingState.AUTO, callback, characteristic);
                        break;
                    default:
                        break;
                }
            })["catch"](function (err) {
                _this.platform.log("There was a problem getting value from: ", service.operatingModeId + " - Err: " + err);
                callback(err, null);
            });
        }
        else {
            if (this.platform.config.enablecoolingstatemanagemnt == "on") {
                var t = parseFloat(properties.targetLevel);
                if (t <= setFunctions_1.lowestTemp)
                    this.returnValue(this.hapCharacteristic.TargetHeatingCoolingState.OFF, callback, characteristic);
                else
                    this.returnValue(this.hapCharacteristic.TargetHeatingCoolingState.HEAT, callback, characteristic);
            }
            else {
                this.returnValue(this.hapCharacteristic.CurrentHeatingCoolingState.HEAT, callback, characteristic);
            }
        }
    };
    GetFunctions.prototype.getTemperatureDisplayUnits = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(this.hapCharacteristic.TemperatureDisplayUnits.CELSIUS, callback, characteristic);
    };
    GetFunctions.prototype.getHue = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(Math.round(this.updateHomeKitColorFromHomeCenter(properties.color, service).h), callback, characteristic);
    };
    GetFunctions.prototype.getSaturation = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(Math.round(this.updateHomeKitColorFromHomeCenter(properties.color, service).s), callback, characteristic);
    };
    GetFunctions.prototype.getCurrentDoorState = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(properties.state == "Closed" ? this.hapCharacteristic.CurrentDoorState.CLOSED : this.hapCharacteristic.CurrentDoorState.OPEN, callback, characteristic);
    };
    GetFunctions.prototype.getObstructionDetected = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(0, callback, characteristic);
    };
    GetFunctions.prototype.getBatteryLevel = function (callback, characteristic, service, IDs, properties) {
        var r = parseFloat(properties.batteryLevel);
        console.log(properties.batteryLevel); 
        console.log(JSON.stringify(characteristic, null, 4));

        this.returnValue(r, callback, characteristic);
    };
    GetFunctions.prototype.getStatusLowBattery = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(1, callback, characteristic); // 1: Low battery
    }
    GetFunctions.prototype.getChargingState = function (callback, characteristic, service, IDs, properties) {
        this.returnValue(2, callback, characteristic); // 2: Not chargeable
    }
    
    GetFunctions.prototype.getSecuritySystemTargetState = function (callback, characteristic, service, IDs, securitySystemStatus) {
        var r;
        if (characteristic.UUID == (new this.hapCharacteristic.SecuritySystemCurrentState()).UUID) {
            r = this.getCurrentSecuritySystemStateMapping.get(securitySystemStatus.value);
        }
        else if (characteristic.UUID == (new this.hapCharacteristic.SecuritySystemTargetState()).UUID) {
            r = this.getTargetSecuritySystemStateMapping.get(securitySystemStatus.value);
        }
        if (r == undefined)
            r = this.hapCharacteristic.SecuritySystemTargetState.DISARMED;
        this.returnValue(r, callback, characteristic);
    };
    GetFunctions.prototype.updateHomeKitColorFromHomeCenter = function (color, service) {
        var colors = color.split(",");
        var r = parseInt(colors[0]);
        var g = parseInt(colors[1]);
        var b = parseInt(colors[2]);
        var w = parseInt(colors[3]);
        service.RGBValue.red = r;
        service.RGBValue.green = g;
        service.RGBValue.blue = b;
        service.RGBValue.white = w;
        var hsv = this.RGBtoHSV(r, g, b, w);
        service.HSBValue.hue = hsv.h;
        service.HSBValue.saturation = hsv.s;
        service.HSBValue.brightness = hsv.v;
        return hsv;
    };
    GetFunctions.prototype.RGBtoHSV = function (r, g, b, w) {
        if (arguments.length === 1) {
            g = r.g, b = r.b, r = r.r;
        }
        var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h, s = (max === 0 ? 0 : d / max), v = Math.max(max, w) / 255;
        switch (max) {
            case min:
                h = 0;
                break;
            case r:
                h = (g - b) + d * (g < b ? 6 : 0);
                h /= 6 * d;
                break;
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }
        return {
            h: h * 360.0,
            s: s * 100.0,
            v: v * 100.0
        };
    };
    return GetFunctions;
}());
exports.GetFunctions = GetFunctions;
