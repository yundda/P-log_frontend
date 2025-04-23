import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const selectedpetNameState = atom({
  key: 'selectedpetNameState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const selectedPetProfileState = atom({
  key: 'selectedPetProfileState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const selectedPetState = atom({
  key: 'selectedPetState',
  default: null,
  effects_UNSTABLE: [persistAtom], // localStorage에 저장
});
