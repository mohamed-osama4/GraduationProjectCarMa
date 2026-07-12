import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:lottie/lottie.dart';

class AppImage extends StatelessWidget {
  const AppImage({super.key, required this.image, this.height, this.width, this.color, this.fit});

final String image;
final double? height, width;
final Color? color;
final BoxFit? fit;

  @override
  Widget build(BuildContext context) {
   if(image.toLowerCase().endsWith('svg')){
     return SvgPicture.asset('assets/icons/$image',
     colorFilter: color != null ?  ColorFilter.mode( color!, BlendMode.srcIn)
     : null,
     height: height,
     width: width,
     );

  }else if(image.startsWith('http')){
    return Image.network(image,
    height: height,
    width: width,
    color: color,
    fit: fit,
    );
  }else if(image.endsWith('json')){
    return Lottie.asset('assets/lotties/$image',
    height: height,
    width: width,
    );
  }else{
    return Image.asset('assets/images/$image',
    height: height,
    width: width,
    color: color,
    fit: fit,
    );
  }
  }
}