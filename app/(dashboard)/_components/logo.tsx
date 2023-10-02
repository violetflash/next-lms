// @flow
import Image from 'next/image';
import * as React from 'react';

type Props = {

};
export const Logo = (props: Props) => {
  return (
    <Image
      src="/logo.svg"
      height={130}
      width={130}
      alt="logo"
    />
  );
};