export interface PassportData {
  surname: string;
  givenNames: string;
  nationality: string;
  dateOfBirth: string;
  placeOfBirth: string;
  sex: 'M' | 'F' | 'X';
  dateOfIssue: string;
  dateOfExpiry: string;
  authority: string;
  passportNumber: string;
  personalNumber: string;
  relationshipStatus: string;
  residentialAddress: string;
  city: string;
  postalCode: string;
  emailAddress: string;
  phoneNumber: string;
  signatureText: string;
  photoUrl: string;
}

export interface SecurityOverlay {
  showGuilloche: boolean;
  showWatermark: boolean;
  showUvLight: boolean;
  showMrzLayout: boolean;
  isHologramActive: boolean;
  showLandmarks: boolean;
  uvIntensity?: number; // 0 to 100
  
  // Advanced Admin Customizations
  scanSpeedSec?: number;
  laserColor?: 'cyan' | 'green' | 'rose' | 'amber';
  signatureInk?: 'black' | 'blue' | 'purple';
  watermarkOpacity?: number; // 0.05 to 0.50
  hologramPattern?: 'stars' | 'hexagons' | 'stripes';
  biometricMatchScore?: number; // 90 to 100
  
  // Passport Photo Physical Styling Properties
  photoFilter?: 'digital' | 'analog-print' | 'biometric-mono' | 'vintage-faded';
  overlayStamp?: boolean;
  guillocheOverPhoto?: boolean;
  paperFiber?: boolean;
  photoHologram?: boolean;

  // Modern Technology properties
  quantumKeyVerified?: boolean;
  irisMatchScore?: number; // 95 to 100
  irisScanActive?: boolean;
  nfcChipVerified?: boolean;
  showMagnifier?: boolean;
}
