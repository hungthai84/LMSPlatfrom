export interface WallpaperItem {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  type: "image" | "video" | "gradient" | "pattern";
  style?: any;
}

export const IMAGE_WALLPAPERS: WallpaperItem[] = [
  {
    id: "img-1",
    name: "Minimalist White Space",
    url: "https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg",
    type: "image"
  },
  {
    id: "img-2",
    name: "Geometric Mountain",
    url: "https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg",
    type: "image"
  },
  {
    id: "img-3",
    name: "Phong cảnh 15",
    url: "https://i.ibb.co/R4P1zff0/ta-i-xu-ng-15.jpg",
    type: "image"
  },
  {
    id: "img-4",
    name: "Phong cảnh 14",
    url: "https://i.ibb.co/TDnD5NB1/ta-i-xu-ng-14.jpg",
    type: "image"
  },
  {
    id: "img-5",
    name: "Phong cảnh 13",
    url: "https://i.ibb.co/S49fBKcv/ta-i-xu-ng-13.jpg",
    type: "image"
  },
  {
    id: "img-6",
    name: "Phong cảnh 12",
    url: "https://i.ibb.co/04qypw8/ta-i-xu-ng-12.jpg",
    type: "image"
  },
  {
    id: "img-7",
    name: "Bright Dream Abstract",
    url: "https://i.ibb.co/ch1yf4Dz/AVv-Xs-Egn6ve-Lq-M6aj-Fr-XO6-YYuy-NTs-Wt-x9-qxb2w-O8-Xt-OWdn-JECETXTri7-Ps-rnb2-Td-Jnln6xu-kddyc-Yisi1xf.jpg",
    type: "image"
  },
  {
    id: "img-8",
    name: "Best Wallpaper Premium",
    url: "https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg",
    type: "image"
  },
  {
    id: "img-9",
    name: "Artistic Scene",
    url: "https://i.ibb.co/rKL4ffH2/2.jpg",
    type: "image"
  },
  {
    id: "img-10",
    name: "Phong cảnh 12 B",
    url: "https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg",
    type: "image"
  },
  {
    id: "img-11",
    name: "Pearlescent Minimal",
    url: "https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg",
    type: "image"
  },
  {
    id: "img-12",
    name: "Minimalist Grid Wallpaper",
    url: "https://i.ibb.co/Fc1dczn/Wallpaper.jpg",
    type: "image"
  },
  {
    id: "img-13",
    name: "Phong cảnh 15 B",
    url: "https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg",
    type: "image"
  },
  {
    id: "img-14",
    name: "Pastel Minimal MacBook",
    url: "https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg",
    type: "image"
  },
  {
    id: "img-15",
    name: "Phong cảnh 14 B",
    url: "https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg",
    type: "image"
  },
  {
    id: "img-16",
    name: "Phong cảnh 13 B",
    url: "https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg",
    type: "image"
  },
  {
    id: "img-17",
    name: "Phong cảnh 16",
    url: "https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg",
    type: "image"
  },
  {
    id: "img-18",
    name: "Abstract Gradient Circle",
    url: "https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg",
    type: "image"
  },
  {
    id: "img-19",
    name: "Calm Mentality Rest",
    url: "https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg",
    type: "image"
  }
];

export const VIDEO_WALLPAPERS: WallpaperItem[] = [
  {
    id: "vid-1",
    name: "Aura Glow Motion",
    url: "https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4",
    type: "video"
  },
  {
    id: "vid-2",
    name: "Flowing Liquid Gradient",
    url: "https://cdn.dribbble.com/userupload/9438742/file/original-9334dd4051bb585cc561e8be06870b39.mp4",
    type: "video"
  },
  {
    id: "vid-3",
    name: "Satisfying Waves",
    url: "https://cdn.dribbble.com/userupload/4241992/file/original-1fcb82b5ace105f3ec88a2deb08e842d.mp4",
    type: "video"
  },
  {
    id: "vid-4",
    name: "Abstract Dynamic Loop",
    url: "https://cdn.dribbble.com/userupload/34993295/file/original-2ea4b30fcd7c6eac3ca0f4d5bfd3d67b.mp4",
    type: "video"
  },
  {
    id: "vid-5",
    name: "Cyberpunk Digital Net",
    url: "https://cdn.dribbble.com/userupload/32536603/file/original-db8060ba2540c3bf1cd2f30b4984cd51.mp4",
    type: "video"
  },
  {
    id: "vid-6",
    name: "Cosmic Nebula Dust",
    url: "https://cdn.dribbble.com/userupload/32480516/file/original-f4a88d4031fee315e3175bf1834c24b4.mp4",
    type: "video"
  },
  {
    id: "vid-7",
    name: "Futuristic Glassmorphism",
    url: "https://cdn.dribbble.com/userupload/32404914/file/original-57644971c47c0d16f90a68404a5e65c1.mp4",
    type: "video"
  },
  {
    id: "vid-8",
    name: "Dreamy Clouds Overlay",
    url: "https://cdn.dribbble.com/userupload/16365481/file/original-527fee647d12f31fce8a309ad136c4bb.mp4",
    type: "video"
  },
  {
    id: "vid-9",
    name: "Minimal Lines Wave",
    url: "https://cdn.dribbble.com/userupload/15594644/file/original-6008d4b0ddcff73c116cb7989a144a71.mp4",
    type: "video"
  },
  {
    id: "vid-10",
    name: "Iridescent Silk Loop",
    url: "https://cdn.dribbble.com/userupload/14779635/file/original-1aca59fc5dc52bee9dcd291a27effcbf.mp4",
    type: "video"
  },
  {
    id: "vid-11",
    name: "Abstract Lava Bubble",
    url: "https://cdn.dribbble.com/userupload/10782874/file/original-06f7280dda982b62cd9452b0da032598.mp4",
    type: "video"
  },
  {
    id: "vid-12",
    name: "Interactive Particle Sand",
    url: "https://cdn.dribbble.com/userupload/32524948/file/original-3c68e4ad227ae70e1875ef71289be2b0.mp4",
    thumbnail: "https://i.postimg.cc/jS3rSGdF/videoframe-8901.png",
    type: "video"
  },
  {
    id: "vid-13",
    name: "3D Geometric Spheres",
    url: "https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4",
    thumbnail: "https://i.postimg.cc/BnmJ1jNN/videoframe-3046.png",
    type: "video"
  },
  {
    id: "vid-14",
    name: "Liquid Glass Loop",
    url: "https://cdn.dribbble.com/userupload/16718734/file/original-f2df9314dbf922d5452d7a8a5885d744.mp4",
    thumbnail: "https://i.postimg.cc/NfYtJ6zp/videoframe-1990.png",
    type: "video"
  },
  {
    id: "vid-15",
    name: "Fluid Kinetic Aura",
    url: "https://cdn.dribbble.com/userupload/43797830/file/original-b9bafe56dd75a7ae175f827cfc662738.mp4",
    thumbnail: "https://i.postimg.cc/yNJW1hB0/videoframe-3097.png",
    type: "video"
  },
  {
    id: "vid-16",
    name: "Calm Flowing Fog",
    url: "https://cdn.dribbble.com/userupload/16365364/file/original-dcc3ad4c0f5802c6670d36fcca720e5e.mp4",
    thumbnail: "https://i.postimg.cc/vBgPtKyD/videoframe-4678.png",
    type: "video"
  },
  {
    id: "vid-17",
    name: "Aesthetic Gradient Wave",
    url: "https://cdn.dribbble.com/userupload/43797856/file/original-46c91cbdf46a3cbc3f30a85f061ed817.mp4",
    thumbnail: "https://i.postimg.cc/L6TVLSPN/videoframe-3537.png",
    type: "video"
  },
  {
    id: "vid-18",
    name: "Gentle Purple Fluid",
    url: "https://cdn.dribbble.com/userupload/12532568/file/original-816b8af88c5a4336e9f0467a7848033e.mp4",
    type: "video"
  },
  {
    id: "vid-19",
    name: "Soft Pastel Gradient Glow",
    url: "https://cdn.dribbble.com/userupload/9535990/file/original-3a87c5fdf2433287d096795a11fa9ee4.mp4",
    type: "video"
  },
  {
    id: "vid-20",
    name: "Floating Orbs Motion",
    url: "https://cdn.dribbble.com/userupload/13253460/file/original-85659da2508a303a516780470e3ae354.mp4",
    type: "video"
  },
  {
    id: "vid-21",
    name: "Abstract Liquid Gold",
    url: "https://cdn.dribbble.com/userupload/9783516/file/original-47f57ffecea5c7874ff6d6c2f0ce42bf.mp4",
    type: "video"
  }
];

export const GRADIENT_WALLPAPERS: WallpaperItem[] = [
  {
    id: "grad-1",
    name: "Dynamic Vivid Aura (Sống động)",
    url: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    type: "gradient"
  },
  {
    id: "grad-2",
    name: "Royal Blue & Indigo",
    url: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
    type: "gradient"
  },
  {
    id: "grad-3",
    name: "Ocean Teal Breeze",
    url: "linear-gradient(45deg, #13547a 0%, #80d0c7 100%)",
    type: "gradient"
  },
  {
    id: "grad-4",
    name: "Peach Cotton Candy",
    url: "linear-gradient(45deg, #ed6ea0 0%, #ec8c69 100%)",
    type: "gradient"
  },
  {
    id: "grad-5",
    name: "Deep Space Eclipse",
    url: "linear-gradient(45deg, #000428 0%, #004e92 100%)",
    type: "gradient"
  },
  {
    id: "grad-6",
    name: "Midnight Obsidian Blue",
    url: "linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    type: "gradient"
  },
  {
    id: "grad-7",
    name: "Cool Blue Horizon",
    url: "linear-gradient(45deg, #373b44 0%, #4286f4 100%)",
    type: "gradient"
  },
  {
    id: "grad-8",
    name: "Orchid Dream Pearl",
    url: "linear-gradient(45deg, #7028e4 0%, #e5b2ca 100%)",
    type: "gradient"
  },
  {
    id: "grad-9",
    name: "Classic Slate Denim",
    url: "linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)",
    type: "gradient"
  },
  {
    id: "grad-10",
    name: "Mint Pastel Blush",
    url: "linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)",
    type: "gradient"
  },
  {
    id: "grad-11",
    name: "Neon Cosmic Fuchsia",
    url: "linear-gradient(45deg, #0250c5 0%, #d43f8d 100%)",
    type: "gradient"
  }
];

export const PATTERN_WALLPAPERS: WallpaperItem[] = [
  {
    id: "pat-1",
    name: "Orbiting Planets (Không gian hành tinh)",
    url: "orbiting-planets",
    thumbnail: "https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    type: "pattern"
  },
  {
    id: "pat-2",
    name: "Light Dotted Minimal Pattern",
    url: "dotted-pattern",
    type: "pattern",
    style: {
      backgroundImage: "radial-gradient(circle at 25% 25%, #a3b1c6 15%, transparent 15%), radial-gradient(circle at 75% 75%, #a3b1c6 15%, transparent 15%)",
      backgroundColor: "#e0e7ed",
      backgroundSize: "10px 10px"
    }
  },
  {
    id: "pat-3",
    name: "Dark Carbon Dotted Pattern",
    url: "dark-dotted-pattern",
    type: "pattern",
    style: {
      backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
      backgroundColor: "#1d1f20",
      backgroundSize: "11px 11px"
    }
  }
];
