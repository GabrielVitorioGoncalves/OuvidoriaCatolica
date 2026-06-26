# ===== BUILD =====
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# copia solution e projetos
COPY . .

# restaura e publica apenas a API
RUN dotnet restore OuvidoriaCatolica.sln

RUN dotnet publish src/OuvidoriaCatolica.API/OuvidoriaCatolica.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ===== RUNTIME =====
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-3000}

ENTRYPOINT ["dotnet", "OuvidoriaCatolica.API.dll"]