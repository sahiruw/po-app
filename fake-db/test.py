import ctypes
path =  'E:/Other/Downloads/DJI_0561.jpg' 

SPI_SETDESKWALLPAPER = 20
ctypes.windll.user32.SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, path , 0)