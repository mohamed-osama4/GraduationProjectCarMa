# مرحلة البناء 
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CarMaintenance.csproj", "./"]
RUN dotnet restore "CarMaintenance.csproj"
COPY . .
RUN dotnet publish "CarMaintenance.csproj" -c Release -o /app/publish /p:UseAppHost=false

# المرحلة النهائية - هنا التغيير الجوهري (شيلنا كلمة slim)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CarMaintenance.dll"]