const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "sk-mwgkP28mzyKLyxXM45C8EaC9B7A648Ac8b7e1111D6790b96",
  baseURL: "https://api.xty.app/v1",
});

const getLuxuryItemValidation = async (itemName, model, brand) => {
  const promptText = `请为这款 ${brand}，型号为：${model}的${itemName} 提供当前的市场估值及其估值的原因。请以 JSON 格式返回以下信息：估值（以人民币计）和估值原因。`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{role: "user", content: promptText}],
    // messages: [{ role: 'user', content: 'Say this is a test' }],
      // max_tokens: 150  // Adjust based on expected response length
    });

    console.log(completion.choices[0].message)
    const valuationInfo = parseAndFormatJsonFromMessage(completion.choices[0].message)
    console.log(valuationInfo)
    return valuationInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const  parseAndFormatJsonFromMessage=(message)=> {
    // 移除多余的部分
    const jsonPart = message.content.replace(/```json\n|\n```/g, '');
  
    // 尝试解析JSON数据
    try {
      const jsonData = JSON.parse(jsonPart);
      // 使用正则表达式提取数字
      const valuationNumber = jsonData["估值"].match(/\d+,\d+/)[0].replace(',', '');
  
      // 创建新的对象，并映射原始数据到新的键名上
      const formattedData = {
        valuation: valuationNumber,
        reason: jsonData["估值原因"]
      };
      return formattedData;
    } catch (error) {
      console.error('Parsing error:', error);
      return null;
    }
  }

module.exports = { getLuxuryItemValidation };
