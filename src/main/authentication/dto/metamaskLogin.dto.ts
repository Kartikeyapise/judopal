import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class MetamaskLogin {
  @IsDefined()
  @IsString()
  token: string;

  @IsDefined()
  @IsString()
  signature: string;

  @IsOptional()
  @IsBoolean()
  isWalletConnect?: boolean;
}
