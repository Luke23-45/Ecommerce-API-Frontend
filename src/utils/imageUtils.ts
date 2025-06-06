export const getProductImage = (seed: string, width: number, height: number, tags: string = '') =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, '-')}/${width}/${height}/?${tags}`;