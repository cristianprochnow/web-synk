export type ColorInfo = {
  color_id: number;
  color_name: string;
  color_hex: string;
};

export function listColors(): ColorInfo[] {
  return [
    {
      color_id: 1,
      color_name: 'Primary Blue',
      color_hex: '007BFF'
    },
    {
      color_id: 2,
      color_name: 'Success Green',
      color_hex: '28A745'
    },
    {
      color_id: 3,
      color_name: 'Warning Yellow',
      color_hex: 'FFC107'
    }
  ];
}