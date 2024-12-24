export type ApiCamera = {
  id: number;
  available: string;
  cameraname: string
  cameranumber: string;
  position: number[];
}

export type ApiVideo = {
  id: number;
  cameranumber: string;
  numberplate: string;
  typevehicule: string;
  createat: Date;
}
