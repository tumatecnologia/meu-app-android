const fs = require('fs');
const filePath = 'src/components/tarot/PaymentUploader.jsx';

let content = fs.readFileSync(filePath, 'utf8');

// 1. Remover importações duplicadas
const lines = content.split('\n');
const uniqueImports = [];
const seenImports = new Set();

lines.forEach(line => {
  if (line.includes('import { validatePaymentReceipt }')) {
    if (!seenImports.has('validatePaymentReceipt')) {
      uniqueImports.push(line);
      seenImports.add('validatePaymentReceipt');
    }
  } else {
    uniqueImports.push(line);
  }
});

content = uniqueImports.join('\n');

// 2. Corrigir string não terminada (linha ~90)
// Procura por padrão de string com quebra
content = content.replace(
  /let errorDetails = '🚫 PAGAMENTO REJEITADO:\n\n';/g,
  "let errorDetails = '🚫 PAGAMENTO REJEITADO:\\n\\n';"
);

// 3. Corrigir template strings mal formadas
content = content.replace(
  /errorDetails \+= \`\${index \+ 1}\. \${error}\n\`;/g,
  "errorDetails += `${index + 1}. ${error}\\n`;"
);

// 4. Garantir que todas as strings tenham terminador
content = content.replace(
  /'\n'/g,
  "'\\n'"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Arquivo corrigido!');
