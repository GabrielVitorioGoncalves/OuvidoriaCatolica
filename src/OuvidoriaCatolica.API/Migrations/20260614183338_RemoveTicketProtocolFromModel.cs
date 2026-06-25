using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OuvidoriaCatolica.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTicketProtocolFromModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Protocol",
                table: "Tickets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Protocol",
                table: "Tickets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
