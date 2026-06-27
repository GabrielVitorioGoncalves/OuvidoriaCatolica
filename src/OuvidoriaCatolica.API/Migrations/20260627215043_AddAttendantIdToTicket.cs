using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OuvidoriaCatolica.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendantIdToTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AttendantId",
                table: "Tickets",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttendantId",
                table: "Tickets");
        }
    }
}
