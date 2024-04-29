const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "sk-mwgkP28mzyKLyxXM45C8EaC9B7A648Ac8b7e1111D6790b96",
  baseURL: "https://api.xty.app/v1",
});
const JSONBig= require('json-bigint');
const getLuxuryItemValidation = async (itemName, model, brand) =>{
  const promptText = `请为这款 ${brand}，型号为：${model}的${itemName} 提供当前的市场估值(仅以数字表示,且不能给出范围)及其估值的原因。请根据提供的信息生成一个对象，该对象包含两个键：valuation和reason。键valuation应该是一个字符串，表示估值，而reason应描述估值的原因。请确保输出格式严格如下：\n{\n valuation: '估值',\n reason: '估值原因描述'\n}\n例如，对于Rolex Submariner手表，如果估值为100000元，且主要因为其稀缺性和高需求，输出应如下：\n{\n valuation: '100000',\n reason: '该款Rolex Submariner型号在市场上的供应量较少，同时受到众多收藏家和时尚爱好者的追捧，因此价格较高。此外，该款手表具有稳定的价值保值能力，因此在二手市场上也有很高的交易价格。'\n}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: promptText }],
      max_tokens: 200,
      temperature: 0.1,
      // messages: [{ role: 'user', content: 'Say this is a test' }],
      // max_tokens: 150  // Adjust based on expected response length
    });

    console.log(completion.choices[0].message);
    const valuationInfo = JSONBig.parse(completion.choices[0].message.content);
    console.log(valuationInfo);
    return valuationInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

module.exports = { getLuxuryItemValidation };