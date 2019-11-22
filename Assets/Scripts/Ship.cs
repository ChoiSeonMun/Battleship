using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class Ship
{
    public enum EShip {
        NONE = 0,
        BATTLESHIP,
        CRUISER,
        DESTROYER,
    };

    public static int GetSizeOf(EShip eShip)
    {
        switch (eShip)
        {
            case EShip.BATTLESHIP:
                return 4;
            case EShip.CRUISER:
                return 3;
            case EShip.DESTROYER:
                return 2;
            default:
                throw new System.ComponentModel.InvalidEnumArgumentException();
        }
    }
}
