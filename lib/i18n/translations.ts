export type Language = "en" | "hi" | "mr"

export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      fieldManagement: "Field Management",
      soilHealth: "Soil Health",
      diseaseDetection: "Disease Detection",
      encyclopedia: "Encyclopedia",
      cropManagement: "Crop Management",
      weather: "Weather",
      marketPrices: "Market Prices",
      knowledge: "Knowledge",
      schemes: "Schemes",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      submit: "Submit",
      back: "Back",
      next: "Next",
      retry: "Retry",
      close: "Close",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your farming activities",
      settings: "Settings",
      addCrop: "Add Crop",
      totalArea: "Total Area",
      activeCrops: "Active Crops",
      avgYield: "Avg Yield",
      avgRainfall: "Avg Rainfall",
      hectares: "hectares",
      crops: "crops",
      weather: "Weather",
      upcomingTasks: "Upcoming Tasks",
      quickActions: "Quick Actions",
      soilAnalysis: "Soil Analysis",
      diseaseCheck: "Disease Check",
      marketInfo: "Market Info",
      expertAdvice: "Expert Advice",
    },

    // Weather
    weather: {
      title: "Weather",
      temperature: "Temperature",
      humidity: "Humidity",
      wind: "Wind",
      rainfall: "Rainfall",
      pressure: "Pressure",
      forecast: "5-Day Forecast",
      today: "Today",
      tomorrow: "Tomorrow",
      alert: "Alert",
      alertMessage: "Light rain expected tomorrow. Plan irrigation accordingly.",
      loading: "Loading weather data...",
      unavailable: "Weather data unavailable",
      current: "Current",
      refresh: "Refresh location",
    },

    // Profile
    profile: {
      title: "Complete Your Profile",
      subtitle: "Help us personalize your experience",
      fullName: "Full Name",
      phone: "Phone Number",
      state: "State",
      district: "District",
      village: "Village",
      farmSize: "Farm Size (in acres)",
      mainCrops: "Main Crops",
      soilType: "Soil Type",
      irrigationType: "Irrigation Type",
      submit: "Complete Setup",
    },

    // Field Management
    fieldManagement: {
      title: "Field Management",
      addField: "Add Field",
      editField: "Edit Field",
      deleteField: "Delete Field",
      fieldName: "Field Name",
      fieldSize: "Field Size",
      cropType: "Crop Type",
      soilType: "Soil Type",
      irrigation: "Irrigation",
    },

    // Soil Health
    soilHealth: {
      title: "Soil Health",
      analyze: "Analyze Soil",
      ph: "pH Level",
      nitrogen: "Nitrogen",
      phosphorus: "Phosphorus",
      potassium: "Potassium",
      organicMatter: "Organic Matter",
    },

    // Disease Detection
    diseaseDetection: {
      title: "Disease Detection",
      upload: "Upload Image",
      analyze: "Analyze",
      results: "Results",
      noDisease: "No disease detected",
    },

    // Market Prices
    marketPrices: {
      title: "Market Prices",
      crop: "Crop",
      price: "Price",
      change: "Change",
      market: "Market",
    },
  },

  hi: {
    // Navigation
    nav: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      fieldManagement: "खेत प्रबंधन",
      soilHealth: "मिट्टी स्वास्थ्य",
      diseaseDetection: "रोग पहचान",
      encyclopedia: "विश्वकोश",
      cropManagement: "फसल प्रबंधन",
      weather: "मौसम",
      marketPrices: "बाजार भाव",
      knowledge: "ज्ञान",
      schemes: "योजनाएं",
    },

    // Common
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      save: "सहेजें",
      cancel: "रद्द करें",
      delete: "हटाएं",
      edit: "संपादित करें",
      add: "जोड़ें",
      search: "खोजें",
      filter: "फ़िल्टर",
      submit: "जमा करें",
      back: "वापस",
      next: "अगला",
      retry: "पुनः प्रयास करें",
      close: "बंद करें",
    },

    // Dashboard
    dashboard: {
      title: "डैशबोर्ड",
      subtitle: "आपकी खेती गतिविधियों का अवलोकन",
      settings: "सेटिंग्स",
      addCrop: "फसल जोड़ें",
      totalArea: "कुल क्षेत्र",
      activeCrops: "सक्रिय फसलें",
      avgYield: "औसत उपज",
      avgRainfall: "औसत वर्षा",
      hectares: "हेक्टेयर",
      crops: "फसलें",
      weather: "मौसम",
      upcomingTasks: "आगामी कार्य",
      quickActions: "त्वरित कार्य",
      soilAnalysis: "मिट्टी विश्लेषण",
      diseaseCheck: "रोग जांच",
      marketInfo: "बाजार जानकारी",
      expertAdvice: "विशेषज्ञ सलाह",
    },

    // Weather
    weather: {
      title: "मौसम",
      temperature: "तापमान",
      humidity: "नमी",
      wind: "हवा",
      rainfall: "वर्षा",
      pressure: "दबाव",
      forecast: "5-दिन पूर्वानुमान",
      today: "आज",
      tomorrow: "कल",
      alert: "चेतावनी",
      alertMessage: "कल हल्की बारिश की संभावना है। सिंचाई की योजना बनाएं।",
      loading: "मौसम डेटा लोड हो रहा है...",
      unavailable: "मौसम डेटा उपलब्ध नहीं",
      current: "वर्तमान",
      refresh: "स्थान रिफ्रेश करें",
    },

    // Profile
    profile: {
      title: "अपनी प्रोफ़ाइल पूरी करें",
      subtitle: "हमें आपके अनुभव को वैयक्तिकृत करने में मदद करें",
      fullName: "पूरा नाम",
      phone: "फ़ोन नंबर",
      state: "राज्य",
      district: "जिला",
      village: "गांव",
      farmSize: "खेत का आकार (एकड़ में)",
      mainCrops: "मुख्य फसलें",
      soilType: "मिट्टी का प्रकार",
      irrigationType: "सिंचाई का प्रकार",
      submit: "सेटअप पूरा करें",
    },

    // Field Management
    fieldManagement: {
      title: "खेत प्रबंधन",
      addField: "खेत जोड़ें",
      editField: "खेत संपादित करें",
      deleteField: "खेत हटाएं",
      fieldName: "खेत का नाम",
      fieldSize: "खेत का आकार",
      cropType: "फसल का प्रकार",
      soilType: "मिट्टी का प्रकार",
      irrigation: "सिंचाई",
    },

    // Soil Health
    soilHealth: {
      title: "मिट्टी स्वास्थ्य",
      analyze: "मिट्टी विश्लेषण",
      ph: "पीएच स्तर",
      nitrogen: "नाइट्रोजन",
      phosphorus: "फॉस्फोरस",
      potassium: "पोटेशियम",
      organicMatter: "जैविक पदार्थ",
    },

    // Disease Detection
    diseaseDetection: {
      title: "रोग पहचान",
      upload: "छवि अपलोड करें",
      analyze: "विश्लेषण करें",
      results: "परिणाम",
      noDisease: "कोई रोग नहीं मिला",
    },

    // Market Prices
    marketPrices: {
      title: "बाजार भाव",
      crop: "फसल",
      price: "मूल्य",
      change: "बदलाव",
      market: "बाजार",
    },
  },

  mr: {
    // Navigation
    nav: {
      home: "होम",
      dashboard: "डॅशबोर्ड",
      fieldManagement: "शेत व्यवस्थापन",
      soilHealth: "माती आरोग्य",
      diseaseDetection: "रोग ओळख",
      encyclopedia: "विश्वकोश",
      cropManagement: "पीक व्यवस्थापन",
      weather: "हवामान",
      marketPrices: "बाजार भाव",
      knowledge: "ज्ञान",
      schemes: "योजना",
    },

    // Common
    common: {
      loading: "लोड होत आहे...",
      error: "त्रुटी",
      success: "यश",
      save: "जतन करा",
      cancel: "रद्द करा",
      delete: "हटवा",
      edit: "संपादित करा",
      add: "जोडा",
      search: "शोधा",
      filter: "फिल्टर",
      submit: "सबमिट करा",
      back: "मागे",
      next: "पुढे",
      retry: "पुन्हा प्रयत्न करा",
      close: "बंद करा",
    },

    // Dashboard
    dashboard: {
      title: "डॅशबोर्ड",
      subtitle: "तुमच्या शेती क्रियाकलापांचे विहंगावलोकन",
      settings: "सेटिंग्ज",
      addCrop: "पीक जोडा",
      totalArea: "एकूण क्षेत्र",
      activeCrops: "सक्रिय पिके",
      avgYield: "सरासरी उत्पादन",
      avgRainfall: "सरासरी पाऊस",
      hectares: "हेक्टर",
      crops: "पिके",
      weather: "हवामान",
      upcomingTasks: "आगामी कार्ये",
      quickActions: "जलद कार्ये",
      soilAnalysis: "माती विश्लेषण",
      diseaseCheck: "रोग तपासणी",
      marketInfo: "बाजार माहिती",
      expertAdvice: "तज्ञ सल्ला",
    },

    // Weather
    weather: {
      title: "हवामान",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      wind: "वारा",
      rainfall: "पाऊस",
      pressure: "दाब",
      forecast: "5-दिवसांचा अंदाज",
      today: "आज",
      tomorrow: "उद्या",
      alert: "सूचना",
      alertMessage: "उद्या हलका पाऊस अपेक्षित आहे. सिंचनाचे नियोजन करा.",
      loading: "हवामान डेटा लोड होत आहे...",
      unavailable: "हवामान डेटा उपलब्ध नाही",
      current: "सध्याचे",
      refresh: "स्थान रिफ्रेश करा",
    },

    // Profile
    profile: {
      title: "तुमचे प्रोफाइल पूर्ण करा",
      subtitle: "तुमचा अनुभव वैयक्तिकृत करण्यात आम्हाला मदत करा",
      fullName: "पूर्ण नाव",
      phone: "फोन नंबर",
      state: "राज्य",
      district: "जिल्हा",
      village: "गाव",
      farmSize: "शेताचा आकार (एकरमध्ये)",
      mainCrops: "मुख्य पिके",
      soilType: "मातीचा प्रकार",
      irrigationType: "सिंचन प्रकार",
      submit: "सेटअप पूर्ण करा",
    },

    // Field Management
    fieldManagement: {
      title: "शेत व्यवस्थापन",
      addField: "शेत जोडा",
      editField: "शेत संपादित करा",
      deleteField: "शेत हटवा",
      fieldName: "शेताचे नाव",
      fieldSize: "शेताचा आकार",
      cropType: "पिकाचा प्रकार",
      soilType: "मातीचा प्रकार",
      irrigation: "सिंचन",
    },

    // Soil Health
    soilHealth: {
      title: "माती आरोग्य",
      analyze: "माती विश्लेषण",
      ph: "पीएच पातळी",
      nitrogen: "नायट्रोजन",
      phosphorus: "फॉस्फोरस",
      potassium: "पोटॅशियम",
      organicMatter: "सेंद्रिय पदार्थ",
    },

    // Disease Detection
    diseaseDetection: {
      title: "रोग ओळख",
      upload: "प्रतिमा अपलोड करा",
      analyze: "विश्लेषण करा",
      results: "निकाल",
      noDisease: "कोणताही रोग आढळला नाही",
    },

    // Market Prices
    marketPrices: {
      title: "बाजार भाव",
      crop: "पीक",
      price: "किंमत",
      change: "बदल",
      market: "बाजार",
    },
  },
} as const
