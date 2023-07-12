import { API, AccessoryPlugin, AccessoryConfig, HAP, Logger, Service, CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue } from 'homebridge';

export = (api: API) => {
  api.registerAccessory("homebridge-valve", V);
};

class V implements AccessoryPlugin {
  private readonly log: Logger;
  private readonly valveService: Service;
  private readonly informationService: Service;
  private readonly config: AccessoryConfig;
  private readonly hap: HAP;
  private active: CharacteristicValue;
  private inUse: CharacteristicValue;


  constructor(log: Logger, config: AccessoryConfig, api: API) {
    this.log = log;
    this.config = config;
    this.hap = api.hap;
    this.active = this.hap.Characteristic.Active.INACTIVE
    this.inUse = this.hap.Characteristic.InUse.NOT_IN_USE

    this.valveService = new this.hap.Service.Valve(V.name);

    this.informationService = new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Manufacturer, "David Koller")
      .setCharacteristic(this.hap.Characteristic.Model, "Irrigation Valve v1")
      .setCharacteristic(this.hap.Characteristic.SerialNumber, "420");

    this.valveService.getCharacteristic(this.hap.Characteristic.Active)
      .on(CharacteristicEventTypes.GET, this.handleActiveGet.bind(this))
      .on(CharacteristicEventTypes.SET, this.handleActiveSet.bind(this));

    this.valveService.getCharacteristic(this.hap.Characteristic.InUse)
      .on(CharacteristicEventTypes.GET, this.handleInUseGet.bind(this))
      .on(CharacteristicEventTypes.SET, this.handleInUseSet.bind(this));

    this.valveService.getCharacteristic(this.hap.Characteristic.ValveType)
      .on(CharacteristicEventTypes.GET, this.handleValveTypeGet.bind(this));
  }

  handleActiveGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET Active');
    callback(null, this.active);
  }

  handleActiveSet(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.log.debug('Triggered SET Active:', value);
    this.active = value
    callback(null);
  }

  handleInUseGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET InUse');
    callback(null, this.inUse);
  }

  handleInUseSet(value: CharacteristicValue, callback: CharacteristicSetCallback){
    this.log.debug('Trigered SET InUse');
    this.inUse = value
    callback(null)
  }

  handleValveTypeGet(callback: CharacteristicGetCallback) {
    this.log.debug('Triggered GET ValveType');
    const currentValue = this.hap.Characteristic.ValveType.IRRIGATION;
    callback(null, currentValue);
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.valveService
    ];
  }
}
