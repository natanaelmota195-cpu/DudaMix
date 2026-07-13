<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if (!$email || !$name || !$message) {
        http_response_code(400);
        echo 'Dados inválidos. Por favor, verifique e tente novamente.';
        exit;
    }

    $body = "Novo contato de $name\nEmail: $email\nTelefone: $phone\nMensagem: $message";
    $subject = 'Novo pedido DUDA MIX';

    // Caso deseje, configure o envio por e-mail usando mail().
    // mail('contato@dudamix.com.br', $subject, $body);

    echo 'Obrigado, ' . $name . '! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.';
    exit;
}

http_response_code(405);
echo 'Método não permitido.';
