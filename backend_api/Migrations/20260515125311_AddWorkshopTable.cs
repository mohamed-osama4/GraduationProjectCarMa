using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CarMaintenance.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkshopTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Workshops",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    OwnerName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    OpenTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CloseTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    IsOpen = table.Column<bool>(type: "boolean", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalOrders = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workshops", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceWorkshop",
                columns: table => new
                {
                    ServicesId = table.Column<int>(type: "integer", nullable: false),
                    WorkshopsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceWorkshop", x => new { x.ServicesId, x.WorkshopsId });
                    table.ForeignKey(
                        name: "FK_ServiceWorkshop_Services_ServicesId",
                        column: x => x.ServicesId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceWorkshop_Workshops_WorkshopsId",
                        column: x => x.WorkshopsId,
                        principalTable: "Workshops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceWorkshop_WorkshopsId",
                table: "ServiceWorkshop",
                column: "WorkshopsId");

            migrationBuilder.CreateIndex(
                name: "IX_Workshops_Email",
                table: "Workshops",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Workshops_IsActive",
                table: "Workshops",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Workshops_IsOpen",
                table: "Workshops",
                column: "IsOpen");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceWorkshop");

            migrationBuilder.DropTable(
                name: "Workshops");
        }
    }
}
