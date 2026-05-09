using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarMaintenance.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderImageAndNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Orders",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Orders");
        }
    }
}
