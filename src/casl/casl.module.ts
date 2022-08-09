import { forwardRef, Global, Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { CaslAbilityFactory } from './casl-ability.factory';

@Global()
@Module({
  imports: [forwardRef(() => RolesModule)],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
