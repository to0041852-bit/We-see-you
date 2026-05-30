import { PresetPerson } from "../types";

export const PRESET_PEOPLE: PresetPerson[] = [
  {
    id: "yohani",
    name: "Yohani de Silva",
    role: "Singer & Digital Creator",
    imageAlt: "Yohani - Sri Lankan Pop Singer",
    sampleHelperText: "Famous Sri Lankan singer known for Manike Mage Hithe",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    mockResult: {
      identified: true,
      name: "Yohani de Silva",
      confidence: "High",
      bio: "Yohani Dilhanoka de Silva is a popular Sri Lankan singer, songwriter, and digital content creator who gained global fame with her viral rendition of 'Manike Mage Hithe'.",
      reasoning: "Positively matched facial structures, distinctive nose stud, and modern hairstyle against database documents for Yohani, the famous Sri Lankan musical artist.",
      profiles: [
        { platform: "Facebook", url: "https://www.facebook.com/yohanithedivah", confidence: "High" },
        { platform: "Instagram", url: "https://www.instagram.com/yohanimusic", confidence: "High" },
        { platform: "YouTube", url: "https://www.youtube.com/c/YohaniMusic", confidence: "High" }
      ],
      searchSuggestions: [
        "Yohani latest music release Sri Lanka",
        "Yohani de Silva streaming platforms and tours"
      ]
    },
    mockSources: [
      { title: "Yohani - Wikipedia", url: "https://en.wikipedia.org/wiki/Yohani" },
      { title: "Yohani Official Music Channel - YouTube", url: "https://www.youtube.com/c/YohaniMusic" },
      { title: "Manike Mage Hithe viral sensation history", url: "https://www.bbc.com/news/world-asia-58835848" }
    ]
  },
  {
    id: "hasaranga",
    name: "Wanindu Hasaranga",
    role: "Sri Lankan Cricketer",
    imageAlt: "Wanindu Hasaranga - National Cricket Star",
    sampleHelperText: "Sri Lankan spin bowler, captain in T20Is",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    mockResult: {
      identified: true,
      name: "Wanindu Hasaranga de Silva",
      confidence: "High",
      bio: "Pinnaduwage Wanindu Hasaranga de Silva is a world-class professional cricketer who plays for Sri Lanka and captained the national T20I side. He is an outstanding leg-spin all-rounder.",
      reasoning: "Facial patterns matched against Sri Lanka cricket athlete profiles. Helper parameters match bowler role.",
      profiles: [
        { platform: "Facebook", url: "https://www.facebook.com/waninduhasaranga49", confidence: "High" },
        { platform: "Instagram", url: "https://www.instagram.com/wanindu_49_waniya", confidence: "High" },
        { platform: "YouTube", url: "https://www.youtube.com/results?search_query=Wanindu+Hasaranga", confidence: "Medium" }
      ],
      searchSuggestions: [
        "Wanindu Hasaranga stats Espncricinfo",
        "Wanindu Hasaranga bowling masterclass video analyses"
      ]
    },
    mockSources: [
      { title: "Wanindu Hasaranga Profile - ESPNcricinfo", url: "https://www.espncricinfo.com/cricketers/wanindu-hasaranga-792357" },
      { title: "ICC T20 Player Rankings - All-Rounders", url: "https://www.icc-cricket.com/rankings/mens/player-rankings" }
    ]
  },
  {
    id: "sangakkara",
    name: "Kumar Sangakkara",
    role: "Cricket Legend & MCC President",
    imageAlt: "Kumar Sangakkara - Cricket Legend",
    sampleHelperText: "Legendary left-handed batsman from Sri Lanka",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
    mockResult: {
      identified: true,
      name: "Kumar Sangakkara",
      confidence: "High",
      bio: "Kumar Sangakkara is a former Sri Lankan professional cricketer, commentator, and former president of the MCC. Widely regarded as one of the greatest batsmen in the history of the sport.",
      reasoning: "Recognized as the esteemed former Captain of Sri Lanka Cricket, commentator, and social advocate.",
      profiles: [
        { platform: "Facebook", url: "https://www.facebook.com/OfficialKumarSangakkara", confidence: "High" },
        { platform: "Instagram", url: "https://www.instagram.com/kumarsanga24", confidence: "High" },
        { platform: "YouTube", url: "https://www.youtube.com/results?search_query=Kumar+Sangakkara", confidence: "High" }
      ],
      searchSuggestions: [
        "Kumar Sangakkara MCC Cowdrey Lecture",
        "Kumara Sangakkara commentary schedules and charity"
      ]
    },
    mockSources: [
      { title: "Kumar Sangakkara Biography - Lords MCC", url: "https://www.lords.org" },
      { title: "Sangakkara Cricket Profile Summary", url: "https://www.espncricinfo.com" }
    ]
  }
];
