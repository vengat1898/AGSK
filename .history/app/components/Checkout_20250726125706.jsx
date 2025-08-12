// Replace your existing parseDeliveryDate function and useEffect with these improved versions

const parseDeliveryDate = (dateString) => {
  if (!dateString) {
    console.log("❌ No delivery date string provided");
    return null;
  }
  
  console.log("🔍 Parsing delivery date:", dateString);
  
  try {
    // Handle different possible date formats
    let parsedDate = null;
    
    // Format 1: "DD/MM/YYYY, HH:MM:SS"
    if (dateString.includes(",")) {
      const [datePart, timePart] = dateString.split(", ");
      const [day, month, year] = datePart.split("/");
      
      if (timePart) {
        const [hours, minutes, seconds] = timePart.split(":");
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                             parseInt(hours), parseInt(minutes), parseInt(seconds) || 0);
      } else {
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    // Format 2: "DD/MM/YYYY"
    else if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    // Format 3: ISO string or other formats
    else {
      parsedDate = new Date(dateString);
    }
    
    // Validate the parsed date
    if (isNaN(parsedDate.getTime())) {
      console.log("❌ Invalid date parsed:", parsedDate);
      return null;
    }
    
    console.log("✅ Successfully parsed date:", parsedDate);
    return parsedDate;
    
  } catch (error) {
    console.error("❌ Error parsing delivery date:", error);
    console.error("Original date string:", dateString);
    return null;
  }
};

// Enhanced date comparison logic with better debugging
useEffect(() => {
  console.log("\n========== 📅 Date Comparison Logic ==========");
  console.log("Delivery DateTime param:", deliveryDateTime);
  
  if (!deliveryDateTime) {
    console.log("❌ No delivery date provided");
    setShowEnquiryFlow(false);
    return;
  }

  try {
    const deliveryDate = parseDeliveryDate(deliveryDateTime);
    
    if (!deliveryDate) {
      console.log("❌ Failed to parse delivery date, defaulting to checkout flow");
      setShowEnquiryFlow(false);
      return;
    }

    // Create today's date at midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create comparison date at midnight
    const compareDate = new Date(deliveryDate);
    compareDate.setHours(0, 0, 0, 0);
    
    // Calculate 5 days from today
    const fiveDaysLater = new Date(today);
    fiveDaysLater.setDate(today.getDate() + 5);
    
    // Calculate difference in days for debugging
    const daysDifference = Math.ceil((compareDate - today) / (1000 * 60 * 60 * 24));
    
    console.log("📊 Date Comparison Details:");
    console.log("Today (midnight):", today.toISOString());
    console.log("Delivery Date (midnight):", compareDate.toISOString());
    console.log("Five Days Later:", fiveDaysLater.toISOString());
    console.log("Days difference:", daysDifference);
    
    // Check if delivery is more than 5 days away
    const shouldShowEnquiry = compareDate > fiveDaysLater;
    
    console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
    console.log("Logic: compareDate > fiveDaysLater =", compareDate.getTime(), ">", fiveDaysLater.getTime());
    
    setShowEnquiryFlow(shouldShowEnquiry);
    
  } catch (error) {
    console.error("❌ Error in date comparison useEffect:", error);
    console.error("Stack trace:", error.stack);
    // Default to checkout flow on error
    setShowEnquiryFlow(false);
  }
  
  console.log("===============================================\n");
}, [deliveryDateTime]);

// Additional helper function to validate and format dates for low-end devices
const safeDateComparison = (deliveryDateTime) => {
  if (!deliveryDateTime) return false;
  
  try {
    // Simple string-based date parsing as fallback for very low-end devices
    const dateStr = deliveryDateTime.split(",")[0]; // Get just the date part
    const [day, month, year] = dateStr.split("/").map(num => parseInt(num, 10));
    
    if (!day || !month || !year) return false;
    
    const deliveryDate = new Date(year, month - 1, day);
    const today = new Date();
    const fiveDaysFromNow = new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000));
    
    return deliveryDate > fiveDaysFromNow;
  } catch (error) {
    console.error("Safe date comparison failed:", error);
    return false;
  }
};

// Add this debug component to test date parsing (remove in production)
const DateDebugger = () => {
  if (!deliveryDateTime) return null;
  
  const parsed = parseDeliveryDate(deliveryDateTime);
  const safe = safeDateComparison(deliveryDateTime);
  
  return (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0', margin: 10 }}>
      <Text>Debug Info:</Text>
      <Text>Original: {deliveryDateTime}</Text>
      <Text>Parsed: {parsed ? parsed.toString() : 'null'}</Text>
      <Text>Safe check: {safe ? 'true' : 'false'}</Text>
      <Text>Show enquiry: {showEnquiryFlow ? 'true' : 'false'}</Text>
    </View>
  );
};

// Enhanced useEffect with fallback logic for low-end devices
useEffect(() => {
  console.log("\n========== 📅 Date Comparison Logic ==========");
  console.log("Delivery DateTime param:", deliveryDateTime);
  
  if (!deliveryDateTime) {
    console.log("❌ No delivery date provided");
    setShowEnquiryFlow(false);
    return;
  }

  // Use setTimeout to prevent blocking UI on low-end devices
  const processDateComparison = () => {
    try {
      const deliveryDate = parseDeliveryDate(deliveryDateTime);
      
      if (!deliveryDate) {
        console.log("❌ Primary parsing failed, trying fallback method");
        const fallbackResult = safeDateComparison(deliveryDateTime);
        setShowEnquiryFlow(fallbackResult);
        return;
      }

      // Create today's date at midnight for accurate comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Create comparison date at midnight
      const compareDate = new Date(deliveryDate);
      compareDate.setHours(0, 0, 0, 0);
      
      // Calculate 5 days from today
      const fiveDaysLater = new Date(today);
      fiveDaysLater.setDate(today.getDate() + 5);
      
      // Calculate difference in days for debugging
      const daysDifference = Math.ceil((compareDate - today) / (1000 * 60 * 60 * 24));
      
      console.log("📊 Date Comparison Details:");
      console.log("Today (midnight):", today.toISOString());
      console.log("Delivery Date (midnight):", compareDate.toISOString());
      console.log("Five Days Later:", fiveDaysLater.toISOString());
      console.log("Days difference:", daysDifference);
      
      // Check if delivery is more than 5 days away
      const shouldShowEnquiry = compareDate > fiveDaysLater;
      
      console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
      console.log("Logic: compareDate > fiveDaysLater =", compareDate.getTime(), ">", fiveDaysLater.getTime());
      
      setShowEnquiryFlow(shouldShowEnquiry);
      
    } catch (error) {
      console.error("❌ Error in date comparison:", error);
      // Try fallback method
      const fallbackResult = safeDateComparison(deliveryDateTime);
      setShowEnquiryFlow(fallbackResult);
    }
    
    console.log("===============================================\n");
  };

  // Use setTimeout to prevent blocking on low-end devices
  setTimeout(processDateComparison, 10);
  
}, [deliveryDateTime]);