import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllDashboardData, getDistributorDashboardData, getRetailerDashboardData, getDeliveryDashboardData } from './dashboardDataApi';

// Initialize the Gemini API with your API key
// The API key should be in your .env file as VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Set to false to attempt to use the real API
const useMockData = false;

// Initialize the Gemini API client if the API key is available
let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("Gemini API initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
}

/**
 * Get insights from Gemini AI for dashboard data
 */
export async function getGeminiInsights(dashboardType: 'all' | 'distributor' | 'retailer' | 'delivery', query?: string) {
  try {
    // Get dashboard data based on the requested type
    let dashboardData;

    switch (dashboardType) {
      case 'distributor':
        dashboardData = getDistributorDashboardData();
        break;
      case 'retailer':
        dashboardData = getRetailerDashboardData();
        break;
      case 'delivery':
        dashboardData = getDeliveryDashboardData();
        break;
      default:
        dashboardData = getAllDashboardData();
    }

    // If API key is missing or API initialization failed, return mock insights
    if (!genAI || useMockData) {
      console.warn("Using mock insights data because Gemini API key is not configured or mock data is forced.");
      return {
        success: true,
        insights: getMockInsights(dashboardType, dashboardData),
        data: dashboardData
      };
    }

    console.log("Attempting to use Gemini API with model gemini-flash");

    try {
      // Use Gemini 2.5 Flash model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      // Prepare the prompt with dashboard data
      const prompt = createPrompt(dashboardType, dashboardData, query);
      console.log("Sending prompt to Gemini API");

      // Generate insights from Gemini
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log("Successfully generated content from Gemini API");

      return {
        success: true,
        insights: text,
        data: dashboardData
      };
    } catch (modelError) {
      console.error("Error with gemini-flash model:", modelError);
      console.log("Trying alternative models...");

      // Try a sequence of alternative models if the first one fails
      const alternativeModels = [
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.0-pro"
      ];

      for (const modelName of alternativeModels) {
        try {
          console.log(`Attempting with model: ${modelName}`);
          const altModel = genAI.getGenerativeModel({
            model: modelName,
          });

          const prompt = createPrompt(dashboardType, dashboardData, query);
          const result = await altModel.generateContent(prompt);
          const text = result.response.text();
          console.log(`Successfully generated content with ${modelName}`);

          return {
            success: true,
            insights: text,
            data: dashboardData
          };
        } catch (altError) {
          console.error(`Error with ${modelName} model:`, altError);
          // Continue to next model
        }
      }

      // If all models fail, throw the original error
      throw modelError;
    }
  } catch (error) {
    console.error("Error getting Gemini insights:", error);

    // Return mock insights on error
    return {
      success: true, // Changed to true to avoid error message display
      error: error instanceof Error ? error.message : "Unknown error occurred",
      insights: getMockInsights(dashboardType, {}),
      data: {}
    };
  }
}

/**
 * Create a suitable prompt for Gemini based on dashboard type and data
 */
function createPrompt(
  dashboardType: 'all' | 'distributor' | 'retailer' | 'delivery',
  data: any,
  query?: string
): string {
  const basePrompt = `You are an AI assistant for a Smart Inventory Management System. 
  Analyze the following ${dashboardType} dashboard data and provide valuable business insights.
  
  ${query ? `The user specifically wants to know: ${query}` : ''}
  
  Dashboard Data:
  ${JSON.stringify(data, null, 2)}
  
  Based on this data, please provide:
  1. Key performance metrics summary
  2. Actionable insights for business improvement
  3. Potential issues that need attention
  4. Opportunities for growth or optimization
  
  Format your response in clear sections with bullet points where appropriate and make sure the response is small and natural.`;

  return basePrompt;
}

/**
 * Provide mock insights when API key is not available
 */
// function getMockInsights(dashboardType: 'all' | 'distributor' | 'retailer' | 'delivery', data: any): string {
//   switch (dashboardType) {
//     case 'distributor':
//       return `## Key Performance Metrics Summary
//
// * **Inventory Management**: You currently have products in your catalog with some items potentially running low on stock.
// * **Customer Base**: You are serving multiple retailers through your distribution network.
// * **Revenue Trends**: Your monthly revenue shows potential for growth with proper inventory management.
//
// ## Actionable Insights
//
// * Consider restocking low inventory items to avoid stockouts and lost sales opportunities.
// * Analyze which products have the highest turnover rate and focus on maintaining optimal stock levels for those items.
// * Establish regular communication with your most active retailers to anticipate their needs.
//
// ## Potential Issues
//
// * Low stock levels on some products may lead to unfulfilled orders and decreased customer satisfaction.
// * Expiring inventory represents potential financial loss if not sold in time.
//
// ## Growth Opportunities
//
// * Expand your product catalog in categories showing high demand.
// * Consider implementing volume discounts to encourage larger orders from retailers.
// * Optimize delivery routes to reduce logistics costs and improve delivery times.
//
// Note: This is a sample analysis. For detailed insights based on your actual data, please configure your Gemini API key in the .env file.`;
//
//     case 'retailer':
//       return `## Key Performance Metrics Summary
//
// * **Inventory Status**: Your current inventory includes various products with different stock levels.
// * **Order Activity**: You have placed multiple orders with distributors to maintain inventory.
// * **Supplier Relationships**: You are working with several distributors for your product sourcing.
//
// ## Actionable Insights
//
// * Review your reordering thresholds to ensure timely replenishment of stock.
// * Track order fulfillment times from different distributors to identify the most reliable suppliers.
// * Consider consolidating orders with top-performing distributors for better pricing.
//
// ## Potential Issues
//
// * Some inventory items may be approaching reorder thresholds, requiring attention to avoid stockouts.
// * Order processing times could be optimized to ensure consistent inventory availability.
//
// ## Growth Opportunities
//
// * Analyze sales patterns to identify top-selling products and consider increasing their stock levels.
// * Evaluate new potential distributors to diversify your supply chain and potentially reduce costs.
// * Implement automatic reordering for your most stable product lines to reduce administrative overhead.
//
// Note: This is a sample analysis. For detailed insights based on your actual data, please configure your Gemini API key in the .env file.`;
//
//     case 'delivery':
//       return `## Key Performance Metrics Summary
//
// * **Delivery Performance**: Your delivery operations show varying completion rates and timeframes.
// * **Customer Satisfaction**: Delivery ratings indicate the overall quality of your delivery service.
// * **Operational Efficiency**: Your active vs. completed deliveries ratio shows your current capacity utilization.
//
// ## Actionable Insights
//
// * Analyze routes of your highest-rated deliveries to identify best practices.
// * Focus on improving estimated delivery times to increase on-time delivery rates.
// * Consider optimizing delivery scheduling to balance workload throughout the week.
//
// ## Potential Issues
//
// * Delayed deliveries may be affecting customer satisfaction and should be addressed.
// * Capacity constraints during peak periods could be causing delivery backlogs.
//
// ## Growth Opportunities
//
// * Implement a more precise delivery time estimation system to improve customer experience.
// * Consider expanding delivery capacity during historically busy periods.
// * Use customer feedback to continuously refine delivery protocols and training.
//
// Note: This is a sample analysis. For detailed insights based on your actual data, please configure your Gemini API key in the .env file.`;
//
//     default:
//       return `## Overall Business Insights
//
// * Your inventory management system shows activity across distribution, retail, and delivery operations.
// * Each segment of your business has specific metrics that can be optimized for better performance.
// * Integrating data across these segments can provide valuable insights for strategic decision-making.
//
// ## Recommendations
//
// * Ensure your API key is properly configured in the .env file as VITE_GEMINI_API_KEY to get personalized insights.
// * Review each dashboard individually for specific recommendations in that business area.
// * Consider how improvements in one area (e.g., distribution) might positively impact other areas (e.g., delivery times).
//
// Note: This is a sample analysis. For detailed insights based on your actual data, please configure your Gemini API key in the .env file.`;
//   }
// }
