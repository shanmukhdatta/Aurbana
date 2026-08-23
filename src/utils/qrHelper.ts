import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Generate a PNG Data URL for a given URL/text
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 500,
    margin = 4, // ISO/IEC 18004 required quiet zone of 4 modules for Google Lens & optical scanners
    darkColor = '#000000', // Pure black for maximum optical contrast
    lightColor = '#FFFFFF'
  } = options;

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width,
      margin,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'H'
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code data URL', err);
    throw err;
  }
}

/**
 * Generate SVG string for vector downloads
 */
export async function generateQRCodeSvg(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    margin = 4,
    darkColor = '#000000',
    lightColor = '#FFFFFF'
  } = options;

  try {
    const svgString = await QRCode.toString(text, {
      type: 'svg',
      margin,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'H'
    });
    return svgString;
  } catch (err) {
    console.error('Failed to generate QR code SVG', err);
    throw err;
  }
}

/**
 * Download helper for Data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download helper for SVG
 */
export function downloadSvg(svgContent: string, filename: string) {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
