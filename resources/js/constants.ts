
import { LinkBlock, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: "Linkea Official",
  handle: "@linkea",
  avatar: "https://picsum.photos/id/64/200/200",
  bio: "Creating the future of digital connections ⚡️",
  theme: "sunset",
  
  customDesign: {
      backgroundColor: '#ffffff',
      buttonStyle: 'soft',
      buttonShape: 'rounded',
      buttonColor: '#ffffff',
      buttonTextColor: '#171717',
      fontPair: 'modern'
  },

  seoTitle: "Linkea Oficial | Todos nuestros enlaces",
  seoDescription: "Bienvenido a la pagina oficial de Linkea.",
  googleAnalyticsId: "",
  facebookPixelId: ""
};

export const INITIAL_LINKS: LinkBlock[] = [
  {
    id: '1',
    title: 'Visit our Website',
    url: 'https://linkea.ar',
    isEnabled: true,
    clicks: 1240,
    type: 'classic',
    icon: 'Globe',
    sparklineData: [{ value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 45 }, { value: 35 }, { value: 60 }]
  },
  {
    id: '2',
    title: 'Latest YouTube Video',
    url: 'https://youtube.com/watch?v=xyz',
    isEnabled: true,
    clicks: 856,
    type: 'video',
    icon: 'Youtube',
    showInlinePlayer: true,
    autoPlay: false,
    startMuted: false,
    sparklineData: [{ value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 80 }, { value: 70 }, { value: 90 }]
  },
  {
    id: '3',
    title: 'Chat on WhatsApp',
    url: '',
    phoneNumber: '5491112345678',
    predefinedMessage: 'Hello! I want to contact you regarding...',
    isEnabled: true,
    clicks: 120,
    type: 'whatsapp',
    icon: 'MessageCircle',
    sparklineData: [{ value: 5 }, { value: 8 }, { value: 2 }, { value: 10 }, { value: 5 }, { value: 12 }, { value: 8 }]
  },
  {
    id: '4',
    title: 'Featured Collection',
    url: '',
    headerSize: 'medium',
    isEnabled: true,
    clicks: 0,
    type: 'header',
    icon: 'Type',
    sparklineData: []
  }
];
