// packages
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { IconAi } from './ai-icon';
import { IconAdd } from './add-icon';
import { IconUser } from './user-icon';
import { IconEdit } from './edit-icon';
import { IconBack } from './back-icon';
import { IconInfo } from './info-icon';
import { IconEuro } from './euro-icon';
import { IconClose } from './close-icon';
import { IconSearch } from './search-icon';
import { IconLocation } from './location-icon';

const iconComponents = [
  IconAi,
  IconAdd,
  IconUser,
  IconEdit,
  IconBack,
  IconInfo,
  IconEuro,
  IconClose,
  IconSearch,
  IconLocation,
];

@NgModule({
  declarations: iconComponents,
  imports: [CommonModule],
  exports: iconComponents,
})
export class IconsModule { }
