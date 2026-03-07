{
  description = "My blog using Zola";
  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";
  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        name = "zola";
        packages = with pkgs; [
          rustc
          cargo
          rustfmt
          clippy
          rust-analyzer
          zola
        ];
        shellHook = ''
          echo "Entered devshell for Zola"
          echo "Zola version: $(zola --version)"
        '';
      };
    };
}
