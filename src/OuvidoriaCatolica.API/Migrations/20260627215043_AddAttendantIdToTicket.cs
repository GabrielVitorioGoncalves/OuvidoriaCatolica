using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OuvidoriaCatolica.API.Migrations
{
    public partial class AddAttendantIdToTicket : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // A coluna já existe no banco.
            // Não há nada para executar aqui.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Não remover a coluna, pois ela foi criada manualmente.
        }
    }
}