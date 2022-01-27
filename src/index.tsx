import { NativeModules } from 'react-native';

type MetroipoType = {
  multiply(a: number, b: number): Promise<number>;
};

const { Metroipo } = NativeModules;

export default Metroipo as MetroipoType;
