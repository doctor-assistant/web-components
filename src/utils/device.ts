export const isMobile = () => {
  try{
    const userAgent = navigator.userAgent;
    return /Mobi|Android|iPhone/i.test(userAgent);
  } catch(error) {
    console.error(error)
    return false
  }
}

export const getOSInfo = () => {
  try {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Windows")) {
      return "Windows";
    } else if (userAgent.includes("Mac")) {
      return "MacOS";
    } else if (userAgent.includes("Linux")) {
      return "Linux";
    } else if (userAgent.includes("Android")) {
      return "Android";
    } else if (userAgent.includes("iOS")) {
      return "iOS";
    }
  }  catch(error) {
    console.error(error)
  }
  return "Unknown";
}

export const getBrowserInfo = () => {
  try{
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      return "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("Edg")) {
      return "Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      return "Opera";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      return "Internet Explorer";
    }
  } catch(error) {
    console.error(error)
  }
  return "Unknown";
}

