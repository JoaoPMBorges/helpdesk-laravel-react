<?php

namespace Database\Seeders;

use App\Models\Chamado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $usuarioSuporte = User::updateOrCreate(
            ['email' => 'suporte@horizon.com'],
            [
                'name'     => 'Horizon Suporte',
                'password' => Hash::make('senha123'),
                'role'     => 'suporte',
            ]
        );


        $cliente1 = User::updateOrCreate(
            ['email' => 'carlos.silva@empresa.com.br'],
            [
                'name'     => 'Carlos Eduardo Silva',
                'password' => Hash::make('senha123'),
                'role'     => 'cliente',
            ]
        );

        $cliente2 = User::updateOrCreate(
            ['email' => 'mariana.souza@tech.com.br'],
            [
                'name'     => 'Mariana Souza',
                'password' => Hash::make('senha123'),
                'role'     => 'cliente',
            ]
        );


        $chamadosExemplo = [
            [
                'user_id'   => $cliente1->id,
                'titulo'    => 'Falha intermitente na autenticação via SSO corporativo',
                'descricao' => 'Usuários do departamento financeiro estão recebendo erro HTTP 403 Forbidden ao tentar efetuar login através do provedor OAuth2 corporativo nas primeiras horas da manhã.',
                'status'    => 'em_andamento',
                'resumo_ia' => 'Erro 403 login SSO financeiro',
            ],
            [
                'user_id'   => $cliente2->id,
                'titulo'    => 'Impressora de etiquetas térmicas desconectada da rede local',
                'descricao' => 'O dispositivo de impressão de etiquetas de expedição na porta TCP 9100 parou de responder às requisições do sistema após a manutenção preventiva da rede ontem à noite.',
                'status'    => 'aberto',
                'resumo_ia' => 'Impressora térmica sem resposta rede',
            ],
            [
                'user_id'   => $cliente1->id,
                'titulo'    => 'Lentidão crítica na geração do relatório de fechamento mensal',
                'descricao' => 'Ao solicitar o fechamento contábil com período superior a 90 dias, a consulta ao banco de dados excede o limite de timeout de 60 segundos e aborta a emissão do PDF.',
                'status'    => 'resolvido',
                'resumo_ia' => 'Timeout consulta relatório contábil 90d',
            ],
            [
                'user_id'   => $cliente2->id,
                'titulo'    => 'Incompatibilidade com certificado digital A1 no faturamento',
                'descricao' => 'A emissão de notas fiscais eletrônicas está apresentando mensagem de certificado revogado ou expirado, embora a validade do arquivo .pfx vá até dezembro de 2026.',
                'status'    => 'aberto',
                'resumo_ia' => 'Certificado A1 inválido faturamento NF-e',
            ],
        ];

        foreach ($chamadosExemplo as $dadosChamado) {
            Chamado::updateOrCreate(
                [
                    'titulo'  => $dadosChamado['titulo'],
                    'user_id' => $dadosChamado['user_id'],
                ],
                $dadosChamado
            );
        }
    }
}
