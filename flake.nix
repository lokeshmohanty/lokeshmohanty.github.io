{
  description = "Lokesh Mohanty — personal site and research blog (SolidStart SSG)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.just
          ];

          shellHook = ''
            echo "SolidStart site — 'just dev' to start, 'just build' for static output in .output/public"
          '';
        };
      });
    };
}
