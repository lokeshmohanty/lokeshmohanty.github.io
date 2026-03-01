{
  description = "My blog using Hakyll";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs, ...}: 
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      name = "hakyll";
      packages = with pkgs; [
        (ghc.withPackages(ps: with ps; [
          cabal-install
          hakyll
          blaze-html
          pandoc
          doctemplates
          text
        ]))

        dart-sass # sass
        zlib # compression
      ];
      shellHook = ''
        echo "Entered devshell for Hakyll"
      '';
    };
  };
}

