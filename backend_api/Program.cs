using CarMaintenance.Services.Interfaces;
using CarMaintenance.Services.Implementation;
using CarMaintenance.Services;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Services
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<GeminiAiService>();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// SWAGGER + JWT SETUP
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Car Maintenance API",
        Version = "v1",
        Description = "API for the Car Maintenance management system"
    });

    options.EnableAnnotations();

    // JWT AUTH IN SWAGGER
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("CarMaintenanceDb"));

// JWT AUTHENTICATION
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = "CarServiceAPI",
        ValidAudience = "CarServiceAPI",

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_1234567890")
        )
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Database seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    if (!context.Orders.Any())
    {
        context.Orders.AddRange(
            new CarMaintenance.Models.Order
            {
                UserId = 1,
                VehicleId = 1,
                ServiceId = 1,
                Address = "123 Main St",
                PhoneNumber = "555-1234",
                OrderStatus = CarMaintenance.Models.OrderStatus.New,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new CarMaintenance.Models.Order
            {
                UserId = 2,
                VehicleId = 2,
                ServiceId = 2,
                Address = "456 Oak St",
                PhoneNumber = "555-5678",
                OrderStatus = CarMaintenance.Models.OrderStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            }
        );

        context.SaveChanges();
    }
}

// Middleware order
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();