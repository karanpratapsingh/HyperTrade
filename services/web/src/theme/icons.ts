import { toLower } from 'lodash';
import { Balance } from '../api/balance';

export function getCryptoIcon(asset: Balance['asset']): string {
  return `https://www.cryptofonts.com/img/icons/${toLower(asset)}.svg`;
}
